'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import IdeaCard from '@/app/ideas/IdeaCard';
import IdeasControls from './IdeasControls';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Idea } from '@/types/idea';
import { Parallax } from 'react-parallax';

type Props = {
  initialIdeas: Idea[];
  total: number;
};

export default function IdeasPage({ initialIdeas, total }: Props) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState('10');
  const [sort, setSort] = useState('-published_at');
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / Number(pageSize));

  const pagedIdeas = ideas
    .slice()
    .sort((a, b) => {
      // Sortir dari yang terbaru (descending)
      if (sort === '-published_at') {
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      }
      // Sortir dari yang terlama (ascending)
      if (sort === 'published_at') {
        // Tambahkan kondisi ini
        return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
      }
      return 0; // Fallback jika 'sort' tidak cocok dengan kondisi di atas
    })
    .slice((pageNumber - 1) * Number(pageSize), pageNumber * Number(pageSize));

  const handlePrev = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const handleNext = () => {
    if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPageNumber(1);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(newPageSize);
    setPageNumber(1);
  };

  return (
    <div className="mt-10">
      <Parallax bgImage="/oke.jpg" strength={500} className="h-[400px]">
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mt-40 drop-shadow-lg">Ideas & Insights</h1>
        </div>
      </Parallax>

      <div className="max-w-5xl mx-auto p-6">
        <IdeasControls pageSize={pageSize} setPageSize={handlePageSizeChange} sort={sort} setSort={handleSortChange} total={total} />

        {loading ? (
          <div className="grid md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[250px] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-4">
            {pagedIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={handlePrev} className={pageNumber === 1 ? 'pointer-events-none opacity-50' : ''} />
              </PaginationItem>
              <PaginationItem className="flex items-center px-4">
                Page {pageNumber} of {totalPages}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext onClick={handleNext} className={pageNumber === totalPages ? 'pointer-events-none opacity-50' : ''} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
