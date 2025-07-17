'use client';

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

type IdeasControlsProps = {
  pageSize: string;
  setPageSize: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  total: number; // Tambah prop total
};

export default function IdeasControls({ pageSize, setPageSize, sort, setSort, total }: IdeasControlsProps) {
  // Hitung range yang ditampilkan berdasarkan pageSize
  const start = 1;
  const end = Math.min(Number(pageSize), total);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 text-sm text-gray-600">
      <p>
        Showing {start} - {end} of {total}
      </p>

      <div className="flex items-center gap-4 mt-4 md:mt-0">
        {/* Show per page */}
        <div className="flex items-center gap-2">
          <label htmlFor="showPerPage" className="whitespace-nowrap">
            Show per page:
          </label>
          <Select value={pageSize} onValueChange={setPageSize}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem> {/* Tambah opsi 100 */}
            </SelectContent>
          </Select>
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-2">
          <label htmlFor="sortBy" className="whitespace-nowrap">
            Sort by:
          </label>
          <Select value={sort === '-published_at' ? 'newest' : 'oldest'} onValueChange={(value) => setSort(value === 'newest' ? '-published_at' : 'published_at')}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Newest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
