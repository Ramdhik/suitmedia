import { Idea } from '@/types/idea';

export async function getInitialIdeas(): Promise<{ ideas: Idea[]; total: number }> {
  let allIdeas: Idea[] = [];
  let page = 1;
  const pageSize = 100; // Batasi ke 100, sesuai batas umum API

  while (true) {
    try {
      const res = await fetch(`https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${page}&page[size]=${pageSize}&append[]=small_image&append[]=medium_image&sort=-published_at`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error(`Failed to fetch ideas for page ${page}: ${res.statusText}`);
      const data = await res.json();

      if (data.data && Array.isArray(data.data)) {
        allIdeas = [...allIdeas, ...data.data];
      } else {
        console.warn(`No data array for page ${page}, stopping fetch`);
        break;
      }

      const total = data.meta?.total || 0;
      const lastPage = Math.ceil(total / pageSize);

      if (page >= lastPage || allIdeas.length >= total) break;
      page++;
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      break;
    }
  }

  return { ideas: allIdeas, total: allIdeas.length };
}
