'use client';

import { useEffect, useState } from 'react';
import { Idea } from '@/types/idea';
import { Button } from '@/components/ui/button';


export default function IdeaDetailPage() {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedIdea = sessionStorage.getItem('selectedIdea');
        if (storedIdea) {
          const parsedIdea: Idea = JSON.parse(storedIdea);
          setIdea(parsedIdea);
          console.log('Data ide dari sessionStorage:', parsedIdea);
        } else {
          setError('Data ide tidak ditemukan di sessionStorage.');
          console.warn("Tidak ada 'selectedIdea' di sessionStorage.");
        }
      } catch (e) {
        console.error('Gagal mengambil atau mem-parsing ide dari sessionStorage:', e);
        setError('Gagal memuat detail ide.');
      } finally {
        setLoading(false);
      }
    }
  }, []);

  if (loading) {
    return <div>Memuat detail ide...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!idea) {
    return <div>Ide tidak ditemukan atau terjadi kesalahan.</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-4">{idea.title}</h1>
      <p className="text-gray-600 mb-2">Dipublikasikan pada: {new Date(idea.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: idea.content }} />

      <Button className="mt-10" onClick={() => window.history.back()}>
        Kembali ke daftar ide
      </Button>
    </div>
  );
}
