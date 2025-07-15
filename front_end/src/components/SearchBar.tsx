import { Search } from "lucide-react";
import { useEntry } from "../contexts/EntryContext";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

const SearchBar = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const { setSearchValue } = useEntry();
  const debounceValue = useDebounce(inputValue, 1000);
  useEffect(() => {
    setSearchValue(debounceValue);
  }, [debounceValue, setSearchValue]);

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
        <Search className="h-5 w-5 text-gray-500 dar:text-gray-400" />
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 rounded-lg
            border border-gray-300 dark:border-gray-700 text-gray-950 dark:text-white 
            placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search entries..."
      />
    </div>
  );
};

export default SearchBar;
