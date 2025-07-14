/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import type { DiaryEntry } from "../types";
import { getEntries } from "../services/entry";

interface EntriesContextType {
  entries: DiaryEntry[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  page: number;
  setPage: (value: number) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  onAddEntry: (entry: DiaryEntry) => void;
  onEditEntry: (entry: DiaryEntry) => void;
  onDeleteEntry: (entryID: string) => void;
  onGetEntry: (entryID: string) => DiaryEntry;
}

const EntryContext = createContext<EntriesContextType | undefined>(undefined);
export const useEntry = () => {
  const context = useContext(EntryContext);
  if (context === undefined)
    throw new Error("useEntry must be used within EntryProvider");
  return context;
};

export const EntryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  useEffect(() => {
    const fetchEntries = async () => {
      const data = await getEntries({
        page,
        pageSize,
        CategoryID: selectedCategory,
        search: searchValue,
      });
      setEntries(data);
    };
    fetchEntries();
  }, [page, pageSize, selectedCategory, searchValue]);
  console.log({ entries });
  const onAddEntry = () => {};
  const onEditEntry = () => {};
  const onDeleteEntry = () => {};
  const onGetEntry = (): DiaryEntry => {
    throw new Error("onGetEntry not implemented");
  };

  return (
    <EntryContext.Provider
      value={{
        entries,
        searchValue,
        setSearchValue,
        selectedCategory,
        setSelectedCategory,
        page,
        setPage,
        pageSize,
        setPageSize,
        onAddEntry,
        onEditEntry,
        onDeleteEntry,
        onGetEntry,
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};
