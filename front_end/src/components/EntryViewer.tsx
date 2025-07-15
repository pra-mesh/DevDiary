import { useEffect, useState, type FC } from "react";
import type { DiaryEntry } from "../types";
import { Calendar, Edit, Tag, X } from "lucide-react";
import { categoryColor } from "../lib/colorMap";
import { formatDate } from "../lib/utils";
import { marked } from "marked";

interface EntryViewerProps {
  entry: DiaryEntry;
  onClose: () => void;
  onEdit: (entry: DiaryEntry) => void;
}

const EntryViewer: FC<EntryViewerProps> = ({ entry, onClose, onEdit }) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
      mangle: false,
    });
  }, []);

  useEffect(() => {
    const renderContent = async () => {
      try {
        const parsed = await marked.parse(entry.content);
        setHtmlContent(parsed);
      } catch (error) {
        console.error("Markdown parsing error:", error);
        setHtmlContent(entry.content);
      }
    };
    renderContent();
  }, [entry.content]);

  return (
    <div className="fixed inset-0  flex items-center justify-center p-4 z-50 backdrop-contrast-50 backdrop-brightness-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl max-h-screen overflow-hidden ">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${
                categoryColor[entry.categoryColor]
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

          <div className="flex items-center space-x-3">
            <button
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 space-x-2"
              onClick={() => onEdit(entry)}
            >
              <Edit className="h-5 w-5" />
              <span>Edit</span>
            </button>
            <button onClick={onClose} className="close-button">
              <X className="w-5 h5" />
            </button>
          </div>
        </div>
        <div className="p-6 h-full overflow-y-auto">
          <div className="max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {entry.title}
            </h1>
          </div>
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
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-3 prose-h3:text-xl prose-h3:font-medium prose-h3:mb-2">
            <div
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryViewer;
