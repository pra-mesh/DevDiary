import { useState } from "react";
import CategoryManger from "../components/CategoryManger";
import Header from "../components/Header";
import CategoryFilter from "../components/CategoryFilter";
import SearchBar from "../components/SearchBar";
import { useEntry } from "../contexts/EntryContext";
import EntryCard from "../components/EntryCard";
import type { DiaryEntry } from "../types";
import EntryViewer from "../components/EntryViewer";

const Home = () => {
  const [showCategoryManger, setShowCategoryManager] = useState(false);
  const [showEntryView, setShowEntryView] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<DiaryEntry | null>(null);
  const { entries, searchValue, selectedCategory } = useEntry();

  const handleCloseCategoryManager = () => {
    setShowCategoryManager(false);
  };
  const handleEdit = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setShowEntryView(true);
    setViewingEntry(null);
  };
  const handleView = (entry: DiaryEntry) => {
    setEditingEntry(null);
    setViewingEntry(entry);
    setShowEntryView(false);
  };
  const handleCloseEntryViewer = () => {
    setViewingEntry(null);
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
                  <EntryCard
                    entry={entry}
                    key={entry.id}
                    onEdit={handleEdit}
                    onView={handleView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {showCategoryManger && (
        <CategoryManger onClose={handleCloseCategoryManager} />
      )}
      {viewingEntry && (
        <EntryViewer
          entry={viewingEntry}
          onClose={handleCloseEntryViewer}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default Home;
