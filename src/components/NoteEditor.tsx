import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Save, Eye, Edit3, Tag, Clock } from 'lucide-react';
import { useNoteStore } from '../stores/noteStore';
import { Note } from '../types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface NoteEditorProps {
  note: Note;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isPreview, setIsPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  
  const { updateNote, tags } = useNoteStore();

  // 自动保存
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        setSaveStatus('saving');
        updateNote(note.id, { title, content });
        setSaveStatus('saved');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content, note.id, note.title, note.content, updateNote]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSaveStatus('unsaved');
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSaveStatus('unsaved');
  };

  const getTagColor = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    return tag?.color || '#3b82f6';
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          {/* 保存状态 */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            {saveStatus === 'saved' && <Save size={14} className="text-green-500" />}
            {saveStatus === 'saving' && <Clock size={14} className="animate-spin" />}
            <span>
              {saveStatus === 'saved' && '已保存'}
              {saveStatus === 'saving' && '保存中...'}
              {saveStatus === 'unsaved' && '未保存'}
            </span>
          </div>
          
          {/* 标签 */}
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-gray-400" />
            {note.tags.length > 0 ? (
              note.tags.map(tagId => (
                <span
                  key={tagId}
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{
                    backgroundColor: getTagColor(tagId) + '20',
                    color: getTagColor(tagId)
                  }}
                >
                  {tags.find(t => t.id === tagId)?.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">无标签</span>
            )}
          </div>
        </div>

        {/* 预览切换 */}
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {isPreview ? <Edit3 size={14} /> : <Eye size={14} />}
          <span className="text-sm">{isPreview ? '编辑' : '预览'}</span>
        </button>
      </div>

      {/* 编辑器内容 */}
      <div className="flex-1 overflow-auto">
        {/* 标题输入 */}
        <div className="px-6 py-4">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="笔记标题..."
            className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-400 text-gray-800 dark:text-white"
          />
          <div className="mt-2 text-xs text-gray-400">
            创建于 {format(new Date(note.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
            {' · '}
            更新于 {format(new Date(note.updatedAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="px-6 pb-6">
          {isPreview ? (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {content || '*开始编写笔记...*'}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="使用 Markdown 编写笔记..."
              className="w-full h-[calc(100vh-300px)] resize-none bg-transparent border-none outline-none font-mono text-sm leading-relaxed text-gray-700 dark:text-gray-300"
            />
          )}
        </div>
      </div>
    </div>
  );
};
