import React from 'react';
import { Trash2, RotateCcw, X, AlertTriangle } from 'lucide-react';
import { useNoteStore } from '../stores/noteStore';
import { Note } from '../types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrashModal: React.FC<TrashModalProps> = ({ isOpen, onClose }) => {
  const { notes, restoreNote, permanentlyDeleteNote } = useNoteStore();
  
  const deletedNotes = notes.filter(note => note.isDeleted);

  if (!isOpen) return null;

  const handleRestore = (id: string) => {
    restoreNote(id);
  };

  const handlePermanentDelete = (id: string) => {
    if (confirm('确定要永久删除这条笔记吗？此操作无法撤销。')) {
      permanentlyDeleteNote(id);
    }
  };

  const handleClearAll = () => {
    if (confirm(`确定要清空回收站吗？将永久删除 ${deletedNotes.length} 条笔记。`)) {
      deletedNotes.forEach(note => permanentlyDeleteNote(note.id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Trash2 className="text-red-500" size={20} />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">回收站</h2>
            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full">
              {deletedNotes.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-auto p-4">
          {deletedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Trash2 size={48} className="mb-4 opacity-50" />
              <p>回收站是空的</p>
            </div>
          ) : (
            <div className="space-y-2">
              {deletedNotes.map(note => (
                <div
                  key={note.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate">
                      {note.title || '无标题'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {note.content || '无内容'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      删除于 {format(new Date(note.updatedAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleRestore(note.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <RotateCcw size={14} />
                      恢复
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(note.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <X size={14} />
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部 */}
        {deletedNotes.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <AlertTriangle size={16} className="text-yellow-500" />
              <span>回收站中的笔记将在 30 天后自动删除</span>
            </div>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <Trash2 size={16} />
              清空回收站
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
