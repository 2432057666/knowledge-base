import React, { useState } from 'react';
import { Download, Upload, X, FileJson, AlertCircle } from 'lucide-react';
import { useNoteStore } from '../stores/noteStore';

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataModal: React.FC<DataModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importData, setImportData] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { exportData, importData: importStoreData } = useNoteStore();

  if (!isOpen) return null;

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-base-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSuccess('数据已导出');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleImport = () => {
    setError('');
    setSuccess('');
    
    if (!importData.trim()) {
      setError('请输入要导入的数据');
      return;
    }

    try {
      importStoreData(importData);
      setImportData('');
      setSuccess('数据导入成功！');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 2000);
    } catch (err) {
      setError('导入失败：数据格式不正确');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImportData(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">数据管理</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'export'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Download size={16} />
            导出数据
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'import'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload size={16} />
            导入数据
          </button>
        </div>

        {/* 内容 */}
        <div className="p-4">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <FileJson className="text-blue-500 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    导出所有数据
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                    将笔记、文件夹、标签等所有数据导出为 JSON 文件
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download size={18} />
                下载备份文件
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertCircle className="text-yellow-500 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    注意
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                    导入数据将覆盖现有数据，请确保已备份重要内容
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  选择文件或粘贴 JSON 数据
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-3"
                />
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="或在此粘贴 JSON 数据..."
                  className="w-full h-32 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg">
                  {success}
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={!importData.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Upload size={18} />
                导入数据
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
