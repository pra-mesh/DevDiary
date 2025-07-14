export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  categoryID: string;
  categoryName: string;
  categoryColor: string;
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
  page: number;
  pageSize: number;
  CategoryID: string | null;
  search: string | null;
}
