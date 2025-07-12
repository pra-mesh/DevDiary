import { Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getCategories } from "../services/categories";
import type { Category } from "../types";
import { categoryColor } from "../lib/colorMap";

const CategoryManger = ({ onClose }: { onClose: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        console.log({ data });
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-contrast-30 backdrop-brightness-70">
      {/*for interactive parent style pointer-events-none*/}
      <div className="bg-white dark:bg-gray-900 rounded-lg w-[90%] max-w-2xl max-h-screen overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Categories
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
             hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-3 mb-6 ">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  categoryColor[!category.color ? "blue" : category.color]
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white`}
                  >
                    {category.name}
                  </span>
                </div>
                <button
                  //onClick={}
                  className="p-2 text-gray-300 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  title="Delete Category"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManger;
