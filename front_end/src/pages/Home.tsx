import { useState } from "react";
import CategoryManger from "../components/CategoryManger";
import Header from "../components/Header";

const Home = () => {
  const [showCategoryManger, setShowCategoryManager] = useState(false);
  const handleCloseCategoryManager = () => {
    setShowCategoryManager(false);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header openCategories={() => setShowCategoryManager(true)} />;
      <div className="bg-red-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        THIS SIMPLE AAP
      </div>
      {showCategoryManger && (
        <CategoryManger onClose={handleCloseCategoryManager} />
      )}
    </div>
  );
};

export default Home;
