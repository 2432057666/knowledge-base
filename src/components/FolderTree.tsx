import React, { useState } from 'react';
import { Folder, ChevronRight, ChevronDown, Plus, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useNoteStore } from '../stores/noteStore';
import { Folder as FolderType } from '../types';

interface FolderTreeProps {
  folders: FolderType[];
  parentId: string | null;
  level: number;
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onDeleteFolder: (id: string) => void;
  onEditFolder: (id: string, name: string) => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  parentId,
  level,
  selectedFolderId,
  onSelectFolder,
  onDeleteFolder,
  onEditFolder,
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const childFolders = folders.filter(f => f.parentId === parentId);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  const handleEditStart = (folder: FolderType) => {
    setEditingId(folder.id);
    setEditName(folder.name);
  };

  const handleEditSave = (id: string) => {
    if (editName.trim()) {
      onEditFolder(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {childFolders.map(folder => {
        const hasChildren = folders.some(f => f.parentId === folder.id);
        const isExpanded = expanded.has(folder.id);

        return (
          <div key={folder.id}>
            <div
              className={`flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer group ${
                selectedFolderId === folder.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ paddingLeft: `${level * 12 + 8}px` }}
              onClick={() => onSelectFolder(folder.id)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(folder.id);
                }}
                className={`p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  hasChildren ? 'visible' : 'invisible'
                }`}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              <Folder size={16} className="text-yellow-500" />

              {editingId === folder.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleEditSave(folder.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSave(folder.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="flex-1 px-1 py-0.5 text-sm bg-white dark:bg-gray-700 border border-blue-500 rounded outline-none"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="flex-1 text-sm truncate">{folder.name}</span>
              )}

              <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditStart(folder);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder(folder.id);
                  }}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {isExpanded && (
              <FolderTree
                folders={folders}
                parentId={folder.id}
                level={level + 1}
                selectedFolderId={selectedFolderId}
                onSelectFolder={onSelectFolder}
                onDeleteFolder={onDeleteFolder}
                onEditFolder={onEditFolder}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

export default FolderTree;
