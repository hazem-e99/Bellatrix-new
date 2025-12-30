import React, { useState, useEffect, useRef, useMemo } from "react";
import * as HeroiconsOutline from "@heroicons/react/24/outline";
import * as HeroiconsSolid from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * IconPicker Component
 * A reusable component for selecting icons from Heroicons library
 * Features:
 * - 4-column grid layout (calendar-style)
 * - Search/filter functionality
 * - Hover and selected states
 * - Modal popup for icon selection
 */

// Get all outline icons (excluding utility exports)
const getIconList = () => {
  const outlineIcons = Object.entries(HeroiconsOutline)
    .filter(([name]) => name.endsWith("Icon"))
    .map(([name, Component]) => ({
      name: name.replace("Icon", ""),
      displayName: name.replace("Icon", "").replace(/([A-Z])/g, " $1").trim(),
      Component,
      variant: "outline",
    }));

  return outlineIcons;
};

const IconPicker = ({
  value,
  onChange,
  label = "Icon",
  placeholder = "Select an icon...",
  required = false,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  const ICONS_PER_PAGE = 48; // 4 columns x 12 rows

  // Memoize icon list
  const allIcons = useMemo(() => getIconList(), []);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return allIcons;
    const query = searchQuery.toLowerCase();
    return allIcons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(query) ||
        icon.displayName.toLowerCase().includes(query)
    );
  }, [allIcons, searchQuery]);

  // Paginated icons
  const paginatedIcons = useMemo(() => {
    const start = page * ICONS_PER_PAGE;
    return filteredIcons.slice(start, start + ICONS_PER_PAGE);
  }, [filteredIcons, page]);

  const totalPages = Math.ceil(filteredIcons.length / ICONS_PER_PAGE);

  // Find selected icon component
  const selectedIcon = useMemo(() => {
    if (!value) return null;
    return allIcons.find((icon) => icon.name === value);
  }, [value, allIcons]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Reset page when search changes
  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  const handleIconSelect = (iconName) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
  };

  const labelClasses =
    "block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1";
  const inputClasses =
    "w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200";

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      <label className={labelClasses}>
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>

      {/* Input Field with Icon Preview */}
      <div
        ref={inputRef}
        onClick={() => !disabled && setIsOpen(true)}
        className={`${inputClasses} flex items-center justify-between cursor-pointer hover:bg-slate-700/80 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          {selectedIcon ? (
            <>
              <selectedIcon.Component className="h-5 w-5 text-blue-400" />
              <span className="text-white">{selectedIcon.displayName}</span>
            </>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-slate-600/50 rounded transition-colors"
            >
              <XMarkIcon className="h-4 w-4 text-slate-400 hover:text-red-400" />
            </button>
          )}
          <svg
            className={`h-4 w-4 text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Modal/Popup */}
      {isOpen && (
        <div
          ref={modalRef}
          className="absolute z-[9999] mt-2 w-full min-w-[320px] max-w-[400px] bg-slate-800 border border-slate-600/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ maxHeight: "450px" }}
        >
          {/* Search Input */}
          <div className="p-3 border-b border-slate-700">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                autoFocus
              />
            </div>
            <div className="mt-2 text-xs text-slate-400 flex justify-between">
              <span>{filteredIcons.length} icons available</span>
              {totalPages > 1 && (
                <span>
                  Page {page + 1} of {totalPages}
                </span>
              )}
            </div>
          </div>

          {/* Icons Grid - 4 columns */}
          <div
            className="p-3 overflow-y-auto"
            style={{ maxHeight: "300px" }}
          >
            {paginatedIcons.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {paginatedIcons.map((icon) => {
                  const IconComponent = icon.Component;
                  const isSelected = value === icon.name;

                  return (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => handleIconSelect(icon.name)}
                      title={icon.displayName}
                      className={`
                        aspect-square flex flex-col items-center justify-center p-2 rounded-lg
                        transition-all duration-150 border
                        ${
                          isSelected
                            ? "bg-blue-500/30 border-blue-400 text-blue-300"
                            : "bg-slate-700/30 border-slate-600/30 text-slate-300 hover:bg-slate-600/50 hover:border-slate-500 hover:text-white"
                        }
                      `}
                    >
                      <IconComponent className="h-6 w-6" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No icons found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-slate-700 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 text-sm bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-300 transition-colors"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageIndex;
                  if (totalPages <= 5) {
                    pageIndex = i;
                  } else if (page < 3) {
                    pageIndex = i;
                  } else if (page > totalPages - 4) {
                    pageIndex = totalPages - 5 + i;
                  } else {
                    pageIndex = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageIndex}
                      type="button"
                      onClick={() => setPage(pageIndex)}
                      className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                        page === pageIndex
                          ? "bg-blue-500 text-white"
                          : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                      }`}
                    >
                      {pageIndex + 1}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 text-sm bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-300 transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Footer with selected icon info */}
          {selectedIcon && (
            <div className="p-2 border-t border-slate-700 bg-slate-700/30 flex items-center gap-2 text-xs text-slate-400">
              <selectedIcon.Component className="h-4 w-4 text-blue-400" />
              <span>
                Selected: <strong className="text-white">{selectedIcon.displayName}</strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IconPicker;
