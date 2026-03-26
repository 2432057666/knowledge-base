import React from 'react';
import { Tag } from 'lucide-react';
import { useNoteStore } from '../stores/noteStore';

interface SidebarProps {
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedTag, onSelectTag }) => {
  const { tags } = useNoteStore();

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 px-2 mb-2">
        <Tag size={14} className="text-gray-400" />
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">标签</h3>
      </div>
      <div className="flex flex-wrap gap-1.5 px-2">
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => onSelectTag(selectedTag === tag.name ? null : tag.name)}
            className={`px-2.5 py-1 rounded-full text-xs transition-all ${
              selectedTag === tag.name 
                ? 'ring-2 ring-offset-1 dark:ring-offset-gray-900' 
                : 'hover:opacity-80'
            }`}
            style={{ 
              backgroundColor: selectedTag === tag.name ? tag.color : tag.color + '20',
              color: selectedTag === tag.name ? 'white' : tag.color,
              ringColor: tag.color
            }}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};
