export const Base_URL = import.meta.env.VITE_API_URL;
export const API_URL = Base_URL.concat("/api");
export const URLS = {
  Categories: API_URL + "/Categories",
  Entries: API_URL + "/Entries",
};
