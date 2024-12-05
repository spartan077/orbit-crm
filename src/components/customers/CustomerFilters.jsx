import React from 'react';
import { SearchIcon } from '../icons/SearchIcon';

const SORT_OPTIONS = [
  { value: 'name:asc', label: 'Name (A-Z)' },
  { value: 'name:desc', label: 'Name (Z-A)' },
  { value: 'created_at:desc', label: 'Newest First' },
  { value: 'created_at:asc', label: 'Oldest First' }
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

export function CustomerFilters({ filters, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'sort') {
      const [sortBy, sortOrder] = value.split(':');
      onChange({ ...filters, sortBy, sortOrder });
    } else {
      onChange({ ...filters, [name]: value });
    }
  };

  const sortValue = `${filters.sortBy}:${filters.sortOrder}`;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-xs">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search customers..."
          className="block w-full rounded-md border border-gray-200 pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="rounded-md border border-gray-200 py-2 pl-3 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          name="sort"
          value={sortValue}
          onChange={handleChange}
          className="rounded-md border border-gray-200 py-2 pl-3 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}