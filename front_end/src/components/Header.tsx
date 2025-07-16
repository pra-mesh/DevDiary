import { BookOpen, Moon, PlusCircle, Settings, Sun } from "lucide-react";

import { useTheme } from "../contexts/ThemeContext";

const Header = ({
  openCategories,
  addEntry,
}: {
  openCategories: () => void;
  addEntry: () => void;
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white ">
              Dev Diary
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={toggleTheme} className="theme-button">
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button onClick={openCategories} className="theme-button">
              <Settings className="h-5 w-5" />
            </button>
            <button onClick={addEntry} className="primary-button">
              <PlusCircle className="h-5 w-5" />
              <span>New Entry</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
