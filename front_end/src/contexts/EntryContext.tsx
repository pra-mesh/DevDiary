/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import type { DiaryEntry } from "../types";
import {
  deleteEntries,
  getEntries,
  addEntries,
  editEntries,
} from "../services/entry";

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

  const onAddEntry = async (entry: DiaryEntry) => {
    const newCategory = await addEntries(entry);
    if (!newCategory?.data) {
      console.log("New entry was added");
      setPage(1);
    }
  };
  const onEditEntry = async (entry: DiaryEntry) => {
    const editCategory = await editEntries(entry);
    if (!editCategory?.data) {
      console.log("Edit entry succesfully");
      const newEntries = entries.map((e) =>
        e.id === entry.id ? { ...e, ...entry } : e
      );
      setEntries(newEntries);
    }
  };

  const onDeleteEntry = async (entryID: string) => {
    const wasDeleted = await deleteEntries(entryID);
    if (!wasDeleted?.data) {
      setEntries((prev) => prev.filter((x) => x.id !== entryID));
      console.log("Deleted Entry");
    }
  };
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
