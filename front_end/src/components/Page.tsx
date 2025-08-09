import React, { use } from "react";
import { useEntry } from "../contexts/EntryContext";

const Page = () => {
  const { pageSize, page, setPage, setPageSize } = useEntry();
  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[2, 5, 10, 20, 30, 40, 50].map((size) => (
            <option>
                {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Page;
