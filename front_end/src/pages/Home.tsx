import { useState } from "react";
import CategoryManger from "../components/CategoryManger";
import Header from "../components/Header";
import CategoryFilter from "../components/CategoryFilter";
import SearchBar from "../components/SearchBar";
import { useEntry } from "../contexts/EntryContext";
import EntryCard from "../components/EntryCard";

const Home = () => {
  const [showCategoryManger, setShowCategoryManager] = useState(false);
  const { entries, searchValue, selectedCategory } = useEntry();
  const handleCloseCategoryManager = () => {
    setShowCategoryManager(false);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header openCategories={() => setShowCategoryManager(true)} />;
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CategoryFilter />
          </div>
          <div className="lg:col-span-3">
            <SearchBar />

            {entries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                  {searchValue || selectedCategory
                    ? "No entries found"
                    : "No entries yet"}
                </div>
                <button
                  onClick={() => alert("Add")}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Create your first entry
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {entries.map((entry) => (
                  <EntryCard entry={entry} key={entry.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {showCategoryManger && (
        <CategoryManger onClose={handleCloseCategoryManager} />
      )}
    </div>
  );
};

export default Home;
