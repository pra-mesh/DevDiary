import type React from "react";
import type { DiaryEntry } from "../types";
import { categoryColor } from "../lib/colorMap";
import { formatDate, getPreviewText } from "../lib/utils";
import { Calendar, Edit, Eye, Tag, Trash2 } from "lucide-react";
interface EntryCardProps {
  entry: DiaryEntry;
  onEdit: (entry: DiaryEntry) => void;
  onView: (entry: DiaryEntry) => void;
}
const EntryCard: React.FC<EntryCardProps> = ({ entry, onEdit, onView }) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-200
                 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50
                   dark:hover:bg-gray-600 transition-colors duration-200"
    >
      <div className="mb-4">
        <div className="flex items-center justify-between  space-x-3 mb-2">
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${
                categoryColor[entry.categoryColor ?? "blue"]
              }`}
            >
              {entry.categoryName}
            </span>
            {!entry.isPublished && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-300">
                Draft
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button className="card-icon" onClick={() => onView(entry)}>
              <Eye className="h-5 2-w-5" />
            </button>
            <button className="card-icon" onClick={() => onEdit(entry)}>
              <Edit className="h-5 2-w-5" />
            </button>
            <button className="card-icon">
              <Trash2 className="h-5 2-w-5" />
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {entry.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {getPreviewText(entry.content)}
        </p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(entry.createdAt ?? new Date())}</span>
          </div>

          {entry.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <Tag className="h-4 w-4" />
              <span>{entry.tags.join(", ")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryCard;
