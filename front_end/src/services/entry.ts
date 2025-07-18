import { URLS } from "../constant";
import type { DiaryEntry, EntriesQueryParams } from "../types";

export const getEntries = async ({
  page = 1,
  pageSize = 5,
  CategoryID,
  search,
}: EntriesQueryParams) => {
  let url = URLS.Entries + "?page=" + page + "&pageSize=" + pageSize;
  if (CategoryID) {
    url += `&CategoryID=${CategoryID}`;
  }

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Something went wrong");

  return res.json();
};

export const addEntries = async (entry: DiaryEntry) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, categoryName, categoryColor, createdAt, ...rest } = entry;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rest),
  };
  try {
    const res = await fetch(URLS.Entries, options);
    return res.json();
  } catch (error) {
    console.error("error:", error);
  }
};

export const editEntries = async (entry: DiaryEntry) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, categoryName, categoryColor, createdAt, ...rest } = entry;
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rest),
  };
  try {
    const res = await fetch(URLS.Entries + "/" + id, options);
    return res.json();
  } catch (error) {
    console.error("error:", error);
  }
};

export const deleteEntries = async (id: string) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await fetch(URLS.Entries + "/" + id, options);
    return res.json();
  } catch (error) {
    console.error("error:", error);
  }
};
