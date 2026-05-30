"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { motion } from "framer-motion";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  pageSize?: number;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchKey,
  pageSize = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null);

  // Search logic
  const filteredData = searchQuery && searchKey
    ? data.filter((row) => {
        const val = row[searchKey];
        return val ? String(val).toLowerCase().includes(searchQuery.toLowerCase()) : false;
      })
    : data;

  // Sort logic
  const sortedData = [...filteredData];
  if (sortConfig) {
    sortedData.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Pagination logic
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const requestSort = (key: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-4">
      {/* Top Bar (Search) */}
      {searchKey && (
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="input pl-10"
          />
        </div>
      )}

      {/* Table Container */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={col.className}
                    style={{ cursor: col.sortable && typeof col.accessor === "string" ? "pointer" : "default" }}
                    onClick={() => {
                      if (col.sortable && typeof col.accessor === "string") {
                        requestSort(col.accessor as keyof T);
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && typeof col.accessor === "string" && sortConfig?.key === col.accessor && (
                        <span className="text-xs text-gray-400">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIdx) => (
                  <motion.tr
                    key={row._id || row.id || rowIdx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: Math.min(rowIdx * 0.03, 0.3) }}
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={col.className}>
                        {typeof col.accessor === "function"
                          ? col.accessor(row)
                          : (row[col.accessor as string] as React.ReactNode)}
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12 text-gray-400 font-medium">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-gray-500 font-medium">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, totalItems)} of {totalItems} entries
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="btn-icon !p-1.5 border border-gray-100 disabled:opacity-40"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="btn-icon !p-1.5 border border-gray-100 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-semibold px-3 py-1 bg-gray-50 text-gray-700 border border-gray-100 rounded-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-icon !p-1.5 border border-gray-100 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="btn-icon !p-1.5 border border-gray-100 disabled:opacity-40"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
