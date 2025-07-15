import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

import { categoryColor } from "../lib/colorMap";
import { useCategory } from "../contexts/CategoryContext";

const CategoryManger = ({ onClose }: { onClose: () => void }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [description, setDescription] = useState<string>("");
  const useCat = useCategory();
  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const category = {
      name: newCategoryName,
      color: selectedColor,
      description,
    };
    useCat.onAddCategory(category);
    setNewCategoryName("");
    setSelectedColor("blue");
    setShowAddForm(false);
  };
  const handleDeleteCategory = (id: string) => {
    useCat.onDeleteCategory(id);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-contrast-30 backdrop-brightness-70">
      {/*for interactive parent style pointer-events-none*/}
      <div className="bg-white dark:bg-gray-900 rounded-lg w-[90%] max-w-2xl max-h-screen overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Categories
          </h2>
          <button onClick={onClose} className="close-button">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-3 mb-6 ">
            {useCat.categories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-800  rounded-lg `}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center p-3 rounded-full text-sm font-medium text-white
                      ${
                        categoryColor[!category.color ? "blue" : category.color]
                      } `}
                  >
                    {category.name}
                  </span>
                  {/* <span
                    className={`inline-flex items-center px-2 rounded-full text-sm font-medium text-white`}>
                    : {category.description}
                  </span> */}
                </div>

                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 text-gray-500 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400
                   hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  title="Delete Category"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          {!showAddForm ? (
            <button
              className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed
               border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400
                hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-5 w-5" />
              <span>Add Category</span>
            </button>
          ) : (
            <form
              onSubmit={handleSubmitCategory}
              className="space-y-4 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg"
            >
              <div>
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name..."
                  required
                />
              </div>
              <div>
                <label className="form-label">Category Color</label>
                <div className="grid grid-cols-6 gap-2">
                  {Object.entries(categoryColor).map(([key, value]) => {
                    return (
                      <button
                        key={key}
                        type="button"
                        value={key}
                        onClick={() => setSelectedColor(key)}
                        title={key}
                        className={`w-8 h-8 rounded-full ${value} ${
                          selectedColor === key
                            ? "ring-2 ring-offset-2 ring-amber-50 dark:ring-gray-800"
                            : ""
                        }`}
                      ></button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300
                   dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500
                    dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none "
                  style={{
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // Internet Explorer
                  }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManger;
