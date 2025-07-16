/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Category } from "../types";
import {
  addCategory,
  deleteCategory,
  getCategories,
} from "../services/categories";

interface CategoryContextType {
  categories: Category[];
  onAddCategory: (Category: Omit<Category, "id">) => void;
  onDeleteCategory: (categoryId: string) => void;
  onGetCategory: (categoryId: string) => Category;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (context === undefined)
    throw new Error("useCategory must be used within the CategoryProvider");
  return context;
};
export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  const onAddCategory = async (Category: Omit<Category, "id">) => {
    const newCategory = await addCategory(Category);
    if (newCategory?.id) setCategories((prev) => [...prev, newCategory]);
  };
  const onDeleteCategory = async (categoryId: string) => {
    const wasDeleted = await deleteCategory(categoryId);
    console.log(wasDeleted);
    if (!wasDeleted?.data)
      setCategories((prev) => prev.filter((x) => x.id !== categoryId));
    console.log("delete");
  };
  const onGetCategory = (categoryId: string): Category => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }
    return category;
  };
  return (
    <CategoryContext.Provider
      value={{ categories, onAddCategory, onDeleteCategory, onGetCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
