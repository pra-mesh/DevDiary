import { Eye, EyeOff, Hash, Save, X } from "lucide-react";
import type { DiaryEntry } from "../types";
import { useEffect, useState } from "react";
import { categoryColor } from "../lib/colorMap";
import { useCategory } from "../contexts/CategoryContext";
import { parseMarkdown } from "../lib/markdown";
import DOMPurify from "dompurify";
import { useEntry } from "../contexts/EntryContext";
type EntryFormProps = {
  entry?: DiaryEntry | null; // Replace 'any' with the actual type if known
  onCancel: () => void;
};

const EntryForm = ({ entry, onCancel }: EntryFormProps) => {
  const { categories } = useCategory();
  const [showPreview, setShowPreview] = useState(false);
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [tags, setTags] = useState(entry?.tags.join(", ") || "");
  const [isPublished, setIsPublished] = useState(entry?.isPublished || false);
  const [category, setCategory] = useState(
    entry?.categoryID || categories[0]?.id || ""
  );
  const [htmlContent, setHtmlContent] = useState<string>("");
  const { onAddEntry, onEditEntry } = useEntry();
  useEffect(() => {
    const renderContent = async () => {
      try {
        const parsed = await parseMarkdown(content);
        setHtmlContent(DOMPurify.sanitize(parsed));
      } catch (error) {
        console.error("Markdown parsing error:", error);
        setHtmlContent(content);
      }
    };
    renderContent();
  }, [content]);

  const getTagSuggestions = () => {
    const commonTags = [
      "react",
      "typescript",
      "javascript",
      "css",
      "nodejs",
      "python",
      "debugging",
      "performance",
      "learning",
      "frontend",
      "backend",
      "api",
      "database",
      "testing",
      "docker",
      "git",
    ];

    const currentTags = tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag);
    return commonTags.filter((tag) => !currentTags.includes(tag));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    if (entry) {
      const updatedEntry = {
        ...entry,
        title,
        content,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        isPublished,
        categoryID: category,
      };
      onEditEntry(updatedEntry);
    } else {
      const newEntry: DiaryEntry = {
        id: "",
        title,
        content,
        categoryID: category,
        categoryName: categories.find((c) => c.id === category)?.name ?? "",
        categoryColor:
          categories.find((c) => c.id === category)?.color ?? "blue",
        createdAt: new Date(),
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        isPublished,
      };
      onAddEntry(newEntry);
    }
  };
  const addTag = (tag: string) => {
    const currentTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(", ");
      setTags(newTags);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-bg  max-h-[95vh] flex flex-col">
        <div className="modal-header">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {entry ? "Edit Entry" : "Add Entry"}
          </h2>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 
              text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600
               transition-colors duration-200 space-x-2"
            >
              {showPreview ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
              <span>{showPreview ? "Edit" : "Preview"} </span>
            </button>
            <button type="button" onClick={onCancel} className="close-button">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-6 flex flex-col flex-grow overflow-hidden"
        >
          {showPreview ? (
            <div className="relative">
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-lg">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview Mode
                </span>
              </div>
              <div
                className="bg-gradient-to-br from-blue-50   to-indigo-100 dark:from-gray-800
               dark:to-gray-900 p-8 rounded-xl border-2 border-blue-200 dark:border-blue-800
                shadow-inner  max-h-[30rem] overflow-y-auto"
              >
                <div className="mb-6 ">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${
                      categoryColor[
                        categories.find((c) => c.id === category)?.color ??
                          "blue"
                      ] || "bg-gray-600"
                    }`}
                  >
                    {categories.find((c) => c.id === category)?.name ?? ""}
                  </span>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-3 prose-h3:text-xl prose-h3:font-medium prose-h3:mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {title}
                  </h1>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto px-4 space-y-2">
              <div>
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter entry title..."
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <div className="flex items-center space-x-3 h-10">
                    <span
                      className={`text-sm font-medium transition-colors duration-200 ${
                        !isPublished
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      Draft
                    </span>

                    <button
                      type="button"
                      onClick={() => setIsPublished(!isPublished)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                        isPublished
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          isPublished ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-sm font-medium transition-colors duration-200 ${
                        isPublished
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      Published
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="react, typescript, learning..."
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {getTagSuggestions()
                    .slice(0, 12)
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                      >
                        <Hash className="h-3 w-3 mr-1" />
                        {tag}
                      </button>
                    ))}
                </div>
              </div>
              <div>
                <label className="form-label">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                  placeholder="Write your entry content here...
                Markdown supported:
                # Heading
                **Bold** *Italic*
                - List item
                ```code```"
                  required
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-end p-4  space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{entry ? "Update" : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryForm;
