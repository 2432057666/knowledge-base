import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, Folder, Tag, CreateNoteInput, UpdateNoteInput } from '../types';

interface NoteState {
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  
  // Note operations
  addNote: (input: CreateNoteInput) => Note;
  updateNote: (id: string, input: UpdateNoteInput) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  
  // Folder operations
  addFolder: (name: string, parentId?: string | null) => Folder;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  
  // Tag operations
  addTag: (name: string, color?: string) => Tag;
  deleteTag: (id: string) => void;
  
  // Search
  searchNotes: (query: string) => Note[];
  getNotesByTag: (tagName: string) => Note[];
  getNotesByFolder: (folderId: string | null) => Note[];
  
  // Import/Export
  exportData: () => string;
  importData: (json: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const defaultTags: Tag[] = [
  { id: '1', name: '工作', color: '#3b82f6' },
  { id: '2', name: '学习', color: '#10b981' },
  { id: '3', name: '生活', color: '#f59e0b' },
  { id: '4', name: '灵感', color: '#8b5cf6' },
];

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],
      folders: [],
      tags: defaultTags,

      addNote: (input) => {
        const now = new Date().toISOString();
        const newNote: Note = {
          id: generateId(),
          title: input.title,
          content: input.content,
          tags: input.tags || [],
          folderId: input.folderId || null,
          createdAt: now,
          updatedAt: now,
          isDeleted: false,
        };
        set((state) => ({ notes: [newNote, ...state.notes] }));
        return newNote;
      },

      updateNote: (id, input) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...input, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, isDeleted: true } : note
          ),
        }));
      },

      restoreNote: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, isDeleted: false } : note
          ),
        }));
      },

      permanentlyDeleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      addFolder: (name, parentId = null) => {
        const newFolder: Folder = {
          id: generateId(),
          name,
          parentId,
          order: get().folders.length,
        };
        set((state) => ({ folders: [...state.folders, newFolder] }));
        return newFolder;
      },

      updateFolder: (id, name) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, name } : folder
          ),
        }));
      },

      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          notes: state.notes.map((note) =>
            note.folderId === id ? { ...note, folderId: null } : note
          ),
        }));
      },

      addTag: (name, color = '#3b82f6') => {
        const newTag: Tag = {
          id: generateId(),
          name,
          color,
        };
        set((state) => ({ tags: [...state.tags, newTag] }));
        return newTag;
      },

      deleteTag: (id) => {
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
          notes: state.notes.map((note) => ({
            ...note,
            tags: note.tags.filter((tagId) => tagId !== id),
          })),
        }));
      },

      searchNotes: (query) => {
        const { notes } = get();
        const lowerQuery = query.toLowerCase();
        return notes.filter(
          (note) =>
            !note.isDeleted &&
            (note.title.toLowerCase().includes(lowerQuery) ||
              note.content.toLowerCase().includes(lowerQuery))
        );
      },

      getNotesByTag: (tagName) => {
        const { notes, tags } = get();
        const tag = tags.find((t) => t.name === tagName);
        if (!tag) return [];
        return notes.filter(
          (note) => !note.isDeleted && note.tags.includes(tag.id)
        );
      },

      getNotesByFolder: (folderId) => {
        const { notes } = get();
        return notes.filter(
          (note) => !note.isDeleted && note.folderId === folderId
        );
      },

      exportData: () => {
        const { notes, folders, tags } = get();
        return JSON.stringify({ notes, folders, tags }, null, 2);
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          set({
            notes: data.notes || [],
            folders: data.folders || [],
            tags: data.tags || defaultTags,
          });
        } catch (error) {
          console.error('Failed to import data:', error);
          throw new Error('Invalid data format');
        }
      },
    }),
    {
      name: 'knowledge-base-storage',
    }
  )
);
