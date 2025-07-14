import { URLS } from "../constant";
import type { EntriesQueryParams } from "../types";

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
