import React from 'react';
import { FileText, Trash2, MoreVertical } from 'lucide-react';
import { Note } from '../types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface NoteListProps {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({ 
  notes, 
  selectedId, 
  onSelect, 
  onDelete 
}) => {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <FileText size={48} className="mb-4 opacity-50" />
        <p>暂无笔记</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1">
      {notes.map(note => (
        <div
          key={note.id}
          onClick={() => onSelect(note.id)}
          className={`group p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
            selectedId === note.id 
              ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-l-transparent'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium truncate ${
                selectedId === note.id 
                  ? 'text-blue-700 dark:text-blue-300' 
                  : 'text-gray-800 dark:text-gray-200'
              }`}>
                {note.title || '无标题'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {note.content || '无内容'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">
                  {format(new Date(note.updatedAt), 'MM月dd日', { locale: zhCN })}
                </span>
                {note.tags.length > 0 && (
                  <span className="text-xs text-blue-500">
                    {note.tags.length} 个标签
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
