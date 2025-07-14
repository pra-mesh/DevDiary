import { useCategory } from "../contexts/CategoryContext";
import { useEntry } from "../contexts/EntryContext";

const CategoryFilter = () => {
  const { categories } = useCategory();
  const { selectedCategory, setSelectedCategory, } = useEntry();
  return (
    <div
      className="bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700
        rounded-lg p-4 mb-6 transition-colors duration-200"
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Categories
      </h2>
      <div className="space-y-2">
        <button
          className={`w-full text-left px-3 py-2 rounded-lg transition-color duration-200 
            ${
              selectedCategory === null
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 hover:dark:bg-gray-700"
            }`}
          onClick={() => setSelectedCategory(null)}
        >
          All Entries
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-color duration-200 
                ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 hover:dark:bg-gray-700"
                }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
