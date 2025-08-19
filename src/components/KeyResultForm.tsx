import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { KeyResult } from '../types';

interface KeyResultFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keyResult: Omit<KeyResult, 'id' | 'progress' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  keyResult?: KeyResult;
  objectiveId: string;
}

const KeyResultForm: React.FC<KeyResultFormProps> = ({
  isOpen,
  onClose,
  onSave,
  keyResult,
  objectiveId,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: 0,
    current: 0,
    unit: '',
  });

  useEffect(() => {
    if (keyResult) {
      setFormData({
        title: keyResult.title,
        description: keyResult.description,
        target: keyResult.target,
        current: keyResult.current,
        unit: keyResult.unit,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        target: 0,
        current: 0,
        unit: '',
      });
    }
  }, [keyResult, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      objectiveId,
    });
    onClose();
  };

  const commonUnits = ['%', 'users', 'revenue', 'customers', 'features', 'days', 'hours', 'items'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block w-full text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:w-full sm:max-w-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {keyResult ? 'Edit Key Result' : 'Add New Key Result'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter key result title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter key result description"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="current" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Value *
                  </label>
                  <input
                    type="number"
                    id="current"
                    value={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Value *
                  </label>
                  <input
                    type="number"
                    id="target"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                    Unit *
                  </label>
                  <select
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Unit</option>
                    {commonUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              {formData.unit === 'custom' && (
                <div>
                  <label htmlFor="customUnit" className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Unit
                  </label>
                  <input
                    type="text"
                    id="customUnit"
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter custom unit"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  {keyResult ? 'Update' : 'Create'} Key Result
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyResultForm;
