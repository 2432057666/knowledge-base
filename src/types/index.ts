export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags?: string[];
  folderId?: string | null;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
  folderId?: string | null;
}
