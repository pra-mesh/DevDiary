import { URLS } from "../constant";
import type { Category } from "../types";

export const getCategories = async () => {
  const response = await fetch(URLS.Categories);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return await response.json();
};

export const addCategory = (category: Omit<Category, "id">) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  };
  return fetch(URLS.Categories, options)
    .then((response) => response.json())
    .catch((error) => console.error("error:", error));
};
export const deleteCategory = (id: string) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(`${URLS.Categories}/${id}`, options)
    .then((response) => response.json())
    .catch((error) => console.error("error:", error));
};
