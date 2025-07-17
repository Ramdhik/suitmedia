'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import IdeaCard from '@/app/ideas/IdeaCard';
import IdeasControls from './IdeasControls';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Idea } from '@/types/idea';

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

  // Hitung total pages berdasarkan total dan pageSize
  const totalPages = Math.ceil(total / Number(pageSize));

  // Slice ideas berdasarkan pageNumber dan pageSize
  const pagedIdeas = ideas.slice((pageNumber - 1) * Number(pageSize), pageNumber * Number(pageSize));

  const handlePrev = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const handleNext = async () => {
    const nextPage = pageNumber + 1;
    const maxLoadedPage = Math.ceil(ideas.length / Number(pageSize));

    if (nextPage > maxLoadedPage) {
      setLoading(true);
      try {
        const res = await fetch(`https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${nextPage}&page[size]=${pageSize}&append[]=small_image&append[]=medium_image&sort=${sort}`, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`Failed to fetch ideas: ${res.statusText}`);
        const data = await res.json();
        setIdeas((prev) => [...prev, ...data.data]);
      } catch (error) {
        console.error('Error loading next page:', error);
      } finally {
        setLoading(false);
      }
    }
    if (nextPage <= totalPages) setPageNumber(nextPage);
  };

  // Fungsi untuk memuat ulang dengan sort baru
  const handleSortChange = async (newSort: string) => {
    setLoading(true);
    try {
      const res = await fetch(`https://suitmedia-backend.suitdev.com/api/ideas?page[number]=1&page[size]=${pageSize}&append[]=small_image&append[]=medium_image&sort=${newSort}`, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`Failed to fetch ideas: ${res.statusText}`);
      const data = await res.json();
      setIdeas(data.data);
      setSort(newSort);
      setPageNumber(1); // Reset ke halaman 1 saat sort berubah
    } catch (error) {
      console.error('Error sorting ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengubah pageSize dan reset pageNumber
  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(newPageSize);
    setPageNumber(1); // Reset pageNumber ke 1 saat pageSize berubah
  };

  return (
    <div>
      {/* Hero Image Section */}
      <div className="relative h-[400px] bg-cover bg-center" style={{ backgroundImage: `url(/oke.jpg)` }}>
        <div className="absolute inset-0 bg-opacity-40" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-lg">Ideas & Insights</h1>
        </div>
      </div>

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

        {/* Pagination */}
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
                <PaginationNext onClick={handleNext} className={pageNumber === totalPages || loading ? 'pointer-events-none opacity-50' : ''} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
