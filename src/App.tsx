import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Moon, Sun, Trash2, Download, Folder as FolderIcon } from 'lucide-react';
import { useNoteStore } from './stores/noteStore';
import { NoteEditor } from './components/NoteEditor';
import { NoteList } from './components/NoteList';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { TrashModal } from './components/TrashModal';
import { DataModal } from './components/DataModal';
import FolderTree from './components/FolderTree';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  
  const { notes, folders, addNote, deleteNote, addFolder, deleteFolder, updateFolder } = useNoteStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: 新建笔记
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewNote();
      }
      // Ctrl/Cmd + F: 聚焦搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNewNote = useCallback(() => {
    const newNote = addNote({
      title: '新建笔记',
      content: '',
      tags: [],
      folderId: selectedFolderId,
    });
    setSelectedNoteId(newNote.id);
  }, [addNote, selectedFolderId]);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim(), selectedFolderId);
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    if (note.isDeleted) return false;
    
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === null || note.tags.includes(
      useNoteStore.getState().tags.find(t => t.name === selectedTag)?.id || ''
    );
    
    const matchesFolder = selectedFolderId === null || note.folderId === selectedFolderId;
    
    return matchesSearch && matchesTag && matchesFolder;
  });

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* 左侧边栏 */}
        <div className="w-64 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* 标题 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">知识库</h2>
          </div>

          {/* 文件夹树 */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">文件夹</h3>
              <button 
                onClick={() => setIsAddingFolder(true)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* 全部笔记 */}
            <div
              onClick={() => { setSelectedFolderId(null); setSelectedTag(null); }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${
                selectedFolderId === null && selectedTag === null
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <FolderIcon size={16} className="text-yellow-500" />
              <span className="text-sm">全部笔记</span>
              <span className="ml-auto text-xs text-gray-500">
                {notes.filter(n => !n.isDeleted).length}
              </span>
            </div>

            {/* 文件夹列表 */}
            <FolderTree
              folders={folders}
              parentId={null}
              level={0}
              selectedFolderId={selectedFolderId}
              onSelectFolder={(id) => { setSelectedFolderId(id); setSelectedTag(null); }}
              onDeleteFolder={deleteFolder}
              onEditFolder={updateFolder}
            />

            {/* 添加文件夹输入框 */}
            {isAddingFolder && (
              <div className="flex items-center gap-2 px-2 py-1.5">
                <FolderIcon size={16} className="text-yellow-500" />
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={handleAddFolder}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddFolder();
                    if (e.key === 'Escape') { setIsAddingFolder(false); setNewFolderName(''); }
                  }}
                  placeholder="文件夹名称"
                  className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-blue-500 rounded outline-none"
                  autoFocus
                />
              </div>
            )}

            {/* 标签 */}
            <Sidebar 
              selectedTag={selectedTag}
              onSelectTag={(tag) => { setSelectedTag(tag); setSelectedFolderId(null); }}
            />
          </div>

          {/* 底部操作 */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
            <button
              onClick={() => setIsTrashOpen(true)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              <Trash2 size={16} />
              <span className="text-sm">回收站</span>
              {notes.filter(n => n.isDeleted).length > 0 && (
                <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {notes.filter(n => n.isDeleted).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsDataModalOpen(true)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              <Download size={16} />
              <span className="text-sm">数据管理</span>
            </button>
          </div>
        </div>

        {/* 中间栏 - 笔记列表 */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
          {/* 顶部工具栏 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                {selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.name : 
                 selectedTag ? `标签: ${selectedTag}` : '全部笔记'}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="切换主题"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                  onClick={handleNewNote}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  title="新建笔记 (Ctrl+N)"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          {/* 笔记列表 */}
          <NoteList 
            notes={filteredNotes}
            selectedId={selectedNoteId}
            onSelect={setSelectedNoteId}
            onDelete={deleteNote}
          />

          {/* 底部统计 */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
            共 {filteredNotes.length} 条笔记
            {searchQuery && ` (搜索: "${searchQuery}")`}
          </div>
        </div>

        {/* 右侧 - 编辑器 */}
        <div className="flex-1 bg-white dark:bg-gray-800">
          {selectedNote ? (
            <NoteEditor 
              note={selectedNote}
              key={selectedNote.id}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <FolderIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>选择或创建一个笔记开始编辑</p>
                <p className="text-sm mt-2">快捷键: Ctrl+N 新建笔记</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 回收站弹窗 */}
      <TrashModal 
        isOpen={isTrashOpen} 
        onClose={() => setIsTrashOpen(false)} 
      />

      {/* 数据管理弹窗 */}
      <DataModal 
        isOpen={isDataModalOpen} 
        onClose={() => setIsDataModalOpen(false)} 
      />
    </div>
  );
}

export default App;
