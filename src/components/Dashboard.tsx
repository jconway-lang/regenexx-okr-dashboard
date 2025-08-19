import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Target, TrendingUp, Flag, Plus, BarChart3, Filter, Search } from 'lucide-react';
import { Objective, KeyResult, Initiative, DashboardStats } from '../types';
import { storage } from '../utils/storage';
import { calculateDashboardStats, calculateProgress, getStatusFromProgress } from '../utils/helpers';
import ObjectiveForm from './ObjectiveForm';
import ObjectiveCard from './ObjectiveCard';

type TabType = 'objectives' | 'initiatives';

const Dashboard: React.FC = () => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [keyResults, setKeyResults] = useState<KeyResult[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalObjectives: 0,
    completedObjectives: 0,
    totalKeyResults: 0,
    completedKeyResults: 0,
    totalInitiatives: 0,
    completedInitiatives: 0,
    overallProgress: 0,
  });

  const [activeTab, setActiveTab] = useState<TabType>('objectives');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Form states
  const [showObjectiveForm, setShowObjectiveForm] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | undefined>();

  useEffect(() => {
    loadData();
  }, []);

  const updateStats = useCallback(() => {
    const newStats = calculateDashboardStats(objectives, keyResults, initiatives);
    setStats(newStats);
  }, [objectives, keyResults, initiatives]);

  useEffect(() => {
    updateStats();
  }, [updateStats]);

  const loadData = () => {
    const savedObjectives = storage.getObjectives();
    const savedKeyResults = storage.getKeyResults();
    const savedInitiatives = storage.getInitiatives();

    setObjectives(savedObjectives);
    setKeyResults(savedKeyResults);
    setInitiatives(savedInitiatives);
  };

  const handleAddObjective = () => {
    setEditingObjective(undefined);
    setShowObjectiveForm(true);
  };

  const handleSaveObjective = (objectiveData: Omit<Objective, 'id' | 'progress' | 'status' | 'createdAt' | 'updatedAt'>) => {
    if (editingObjective) {
      const updatedObjective: Objective = {
        ...editingObjective,
        ...objectiveData,
        updatedAt: new Date(),
      };
      const newObjectives = objectives.map(obj => 
        obj.id === editingObjective.id ? updatedObjective : obj
      );
      setObjectives(newObjectives);
      storage.saveObjectives(newObjectives);
      setEditingObjective(undefined);
    } else {
      const newObjective: Objective = {
        ...objectiveData,
        id: uuidv4(),
        progress: 0,
        status: 'not-started',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const newObjectives = [...objectives, newObjective];
      setObjectives(newObjectives);
      storage.saveObjectives(newObjectives);
    }
  };

  const handleEditObjective = (objective: Objective) => {
    setEditingObjective(objective);
    setShowObjectiveForm(true);
  };

  const handleDeleteObjective = (id: string) => {
    const newObjectives = objectives.filter(obj => obj.id !== id);
    const newKeyResults = keyResults.filter(kr => kr.objectiveId !== id);
    setObjectives(newObjectives);
    setKeyResults(newKeyResults);
    storage.saveObjectives(newObjectives);
    storage.saveKeyResults(newKeyResults);
  };

  const handleSaveKeyResult = (keyResultData: Omit<KeyResult, 'id' | 'progress' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const progress = calculateProgress(keyResultData.current, keyResultData.target);
    const status = getStatusFromProgress(progress);
    
    const newKeyResult: KeyResult = {
      ...keyResultData,
      id: uuidv4(),
      progress,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newKeyResults = [...keyResults, newKeyResult];
    setKeyResults(newKeyResults);
    storage.saveKeyResults(newKeyResults);

    // Update objective progress
    updateObjectiveProgress(keyResultData.objectiveId);
  };

  const handleUpdateKeyResult = (keyResultData: Omit<KeyResult, 'id' | 'progress' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const progress = calculateProgress(keyResultData.current, keyResultData.target);
    const status = getStatusFromProgress(progress);
    
    // Find the existing key result to update
    const existingKeyResult = keyResults.find(kr => 
      kr.title === keyResultData.title && 
      kr.objectiveId === keyResultData.objectiveId
    );

    if (existingKeyResult) {
      const updatedKeyResult: KeyResult = {
        ...existingKeyResult,
        ...keyResultData,
        progress,
        status,
        updatedAt: new Date(),
      };

      const newKeyResults = keyResults.map(kr => 
        kr.id === existingKeyResult.id ? updatedKeyResult : kr
      );
      setKeyResults(newKeyResults);
      storage.saveKeyResults(newKeyResults);

      // Update objective progress
      updateObjectiveProgress(keyResultData.objectiveId);
    }
  };

  const handleDeleteKeyResult = (id: string) => {
    const keyResult = keyResults.find(kr => kr.id === id);
    const newKeyResults = keyResults.filter(kr => kr.id !== id);
    setKeyResults(newKeyResults);
    storage.saveKeyResults(newKeyResults);

    if (keyResult) {
      updateObjectiveProgress(keyResult.objectiveId);
    }
  };

  const updateObjectiveProgress = (objectiveId: string) => {
    const objectiveKeyResults = keyResults.filter(kr => kr.objectiveId === objectiveId);
    const averageProgress = objectiveKeyResults.length > 0
      ? objectiveKeyResults.reduce((sum, kr) => sum + kr.progress, 0) / objectiveKeyResults.length
      : 0;

    const newObjectives = objectives.map(obj => {
      if (obj.id === objectiveId) {
        return {
          ...obj,
          progress: averageProgress,
          status: getStatusFromProgress(averageProgress),
          updatedAt: new Date(),
        };
      }
      return obj;
    });
    setObjectives(newObjectives);
    storage.saveObjectives(newObjectives);
  };

  const handleAddInitiative = () => {
    const newInitiative: Initiative = {
      id: uuidv4(),
      title: 'New Initiative',
      description: 'Enter initiative description',
      status: 'not-started',
      priority: 'medium',
      startDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newInitiatives = [...initiatives, newInitiative];
    setInitiatives(newInitiatives);
    storage.saveInitiatives(newInitiatives);
  };

  const filteredObjectives = objectives.filter(obj => {
    const matchesSearch = obj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obj.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || obj.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredInitiatives = initiatives.filter(init => {
    const matchesSearch = init.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         init.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || init.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Regenexx OKR Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Overall Progress: <span className="font-semibold text-blue-600">{stats.overallProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Objectives</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completedObjectives}/{stats.totalObjectives}</p>
                <p className="text-sm text-gray-500 mt-1">Completed</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Key Results</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completedKeyResults}/{stats.totalKeyResults}</p>
                <p className="text-sm text-gray-500 mt-1">Completed</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Initiatives</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completedInitiatives}/{stats.totalInitiatives}</p>
                <p className="text-sm text-gray-500 mt-1">Completed</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500">
                <Flag className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.overallProgress}%</p>
                <p className="text-sm text-gray-500 mt-1">Average completion</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-600">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('objectives')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'objectives'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Objectives & Key Results
                </button>
                <button
                  onClick={() => setActiveTab('initiatives')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'initiatives'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Initiatives
                </button>
              </div>
              <button
                onClick={() => {
                  if (activeTab === 'objectives') {
                    handleAddObjective();
                  } else {
                    handleAddInitiative();
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add {activeTab === 'objectives' ? 'Objective' : 'Initiative'}</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="on-track">On Track</option>
                  <option value="at-risk">At Risk</option>
                  <option value="behind">Behind</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'objectives' ? (
            filteredObjectives.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No objectives found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Get started by creating your first objective'}
                </p>
                <button
                  onClick={handleAddObjective}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Add First Objective
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredObjectives.map((objective) => (
                  <ObjectiveCard
                    key={objective.id}
                    objective={objective}
                    keyResults={keyResults}
                    onEdit={handleEditObjective}
                    onDelete={handleDeleteObjective}
                    onSaveKeyResult={handleSaveKeyResult}
                    onUpdateKeyResult={handleUpdateKeyResult}
                    onDeleteKeyResult={handleDeleteKeyResult}
                  />
                ))}
              </div>
            )
          ) : (
            filteredInitiatives.length === 0 ? (
              <div className="text-center py-12">
                <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No initiatives found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Get started by creating your first initiative'}
                </p>
                <button
                  onClick={handleAddInitiative}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Add First Initiative
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredInitiatives.map((initiative) => (
                  <div key={initiative.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Flag className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900">{initiative.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-3">{initiative.description}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-medium text-gray-700">{Math.round(initiative.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300 bg-blue-500"
                          style={{ width: `${initiative.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Forms */}
      <ObjectiveForm
        isOpen={showObjectiveForm}
        onClose={() => {
          setShowObjectiveForm(false);
          setEditingObjective(undefined);
        }}
        onSave={handleSaveObjective}
        objective={editingObjective}
      />
    </div>
  );
};

export default Dashboard;
