export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  date: Date;
  tags: string[];
  isPublished: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
}
