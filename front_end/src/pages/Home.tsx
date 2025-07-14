import { useState } from "react";
import CategoryManger from "../components/CategoryManger";
import Header from "../components/Header";
import CategoryFilter from "../components/CategoryFilter";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const [showCategoryManger, setShowCategoryManager] = useState(false);
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
