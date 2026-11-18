import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnKey: string) => void;
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  sortColumn,
  sortDirection,
  onSort,
  selectedIds,
  onSelectRow,
  onSelectAll,
  isLoading,
  emptyMessage = 'No records found.',
  onRowClick,
}: DataTableProps<T>) {
  const isSelectable = Boolean(onSelectRow && selectedIds);
  const allSelected =
    data.length > 0 && selectedIds && data.every(item => selectedIds.includes(keyExtractor(item)));
  const someSelected =
    selectedIds &&
    selectedIds.length > 0 &&
    data.some(item => selectedIds.includes(keyExtractor(item))) &&
    !allSelected;

  return (
    <div className="w-full overflow-x-auto border-y sm:border sm:rounded-xl border-slate-200 bg-white shadow-2xs">
      <table className="w-full text-left text-sm text-slate-600 border-collapse">
        <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500 select-none">
          <tr>
            {isSelectable && (
              <th className="w-10 px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={Boolean(allSelected)}
                  ref={el => {
                    if (el) el.indeterminate = Boolean(someSelected);
                  }}
                  onChange={() => onSelectAll && onSelectAll()}
                  className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500 cursor-pointer"
                  title="Select all"
                />
              </th>
            )}

            {columns.map(col => {
              const isSorted = sortColumn === col.key;
              return (
                <th
                  key={col.key}
                  className={`px-4 py-3.5 ${col.headerClassName || ''} ${
                    col.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''
                  }`}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-400">
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-brand-600" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-brand-600" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length + (isSelectable ? 1 : 0)}
                className="py-12 text-center text-slate-400"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  <span>Loading records...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (isSelectable ? 1 : 0)}
                className="py-12 text-center text-slate-400 text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const id = keyExtractor(item);
              const isSelected = selectedIds?.includes(id);

              return (
                <tr
                  key={id}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors duration-150 ${
                    onRowClick ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/50'
                  } ${isSelected ? 'bg-brand-50/30' : ''}`}
                >
                  {isSelectable && (
                    <td
                      className="px-4 py-3 text-center"
                      onClick={e => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(isSelected)}
                        onChange={() => onSelectRow && onSelectRow(id)}
                        className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500 cursor-pointer"
                      />
                    </td>
                  )}

                  {columns.map(col => (
                    <td key={col.key} className={`px-4 py-3.5 ${col.className || ''}`}>
                      {col.render
                        ? col.render(item, index)
                        : (item as any)[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
