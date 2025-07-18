export const getPreviewText = (content: string) => {
  const plainText = content
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]*)`/g, "")
    // Remove fenced code blocks like ```js ... ```
    .replace(/```[\s\S]*?```/g, ""); //remove markdown format header and formating
  return plainText.length > 150
    ? plainText.substring(0, 150) + " ..."
    : plainText;
};

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
