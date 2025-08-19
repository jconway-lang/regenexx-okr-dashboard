import React, { useState } from 'react';
import { Target, Edit, Trash2, Plus, TrendingUp } from 'lucide-react';
import { Objective, KeyResult } from '../types';
import { getStatusColor, getStatusText } from '../utils/helpers';
import KeyResultForm from './KeyResultForm';

interface ObjectiveCardProps {
  objective: Objective;
  keyResults: KeyResult[];
  onEdit: (objective: Objective) => void;
  onDelete: (id: string) => void;
  onSaveKeyResult: (keyResult: Omit<KeyResult, 'id' | 'progress' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateKeyResult: (keyResult: Omit<KeyResult, 'id' | 'progress' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteKeyResult: (id: string) => void;
}

const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  keyResults,
  onEdit,
  onDelete,
  onSaveKeyResult,
  onUpdateKeyResult,
  onDeleteKeyResult,
}) => {
  const [showKeyResultForm, setShowKeyResultForm] = useState(false);
  const [editingKeyResult, setEditingKeyResult] = useState<KeyResult | undefined>();

  const objectiveKeyResults = keyResults.filter(kr => kr.objectiveId === objective.id);

  const handleAddKeyResult = () => {
    setEditingKeyResult(undefined);
    setShowKeyResultForm(true);
  };

  const handleEditKeyResult = (keyResult: KeyResult) => {
    setEditingKeyResult(keyResult);
    setShowKeyResultForm(true);
  };

  const handleSaveKeyResult = (keyResultData: Omit<KeyResult, 'id' | 'progress' | 'status' | 'createdAt' | 'updatedAt'>) => {
    if (editingKeyResult) {
      onUpdateKeyResult(keyResultData);
    } else {
      onSaveKeyResult(keyResultData);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">{objective.title}</h3>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(objective.status)}`} />
                <span className="text-xs font-medium text-gray-600">
                  {getStatusText(objective.status)}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-3">{objective.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{objective.quarter}</span>
              <span>•</span>
              <span>{objective.year}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(objective)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(objective.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(objective.progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(objective.status)}`}
              style={{ width: `${objective.progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Key Results</h4>
            <button
              onClick={handleAddKeyResult}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Key Result</span>
            </button>
          </div>

          {objectiveKeyResults.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No key results added yet</p>
          ) : (
            <div className="space-y-2">
              {objectiveKeyResults.map((keyResult) => (
                <div
                  key={keyResult.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <h5 className="text-sm font-medium text-gray-900">{keyResult.title}</h5>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(keyResult.status)}`} />
                        <span className="text-xs font-medium text-gray-600">
                          {getStatusText(keyResult.status)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{keyResult.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{keyResult.current} / {keyResult.target} {keyResult.unit}</span>
                      <span>•</span>
                      <span>{Math.round(keyResult.progress)}%</span>
                    </div>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full transition-all duration-300 ${getStatusColor(keyResult.status)}`}
                          style={{ width: `${keyResult.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditKeyResult(keyResult)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteKeyResult(keyResult.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <KeyResultForm
        isOpen={showKeyResultForm}
        onClose={() => {
          setShowKeyResultForm(false);
          setEditingKeyResult(undefined);
        }}
        onSave={handleSaveKeyResult}
        keyResult={editingKeyResult}
        objectiveId={objective.id}
      />
    </>
  );
};

export default ObjectiveCard;
