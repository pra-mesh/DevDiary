export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  categoryID:string;
  category: string;
  createdAt: Date;
  tags: string[];
  isPublished: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface EntriesQueryParams {
  page: Number;
  pageSize: Number;
  CategoryID: string | null;
  search: string | null;
}
