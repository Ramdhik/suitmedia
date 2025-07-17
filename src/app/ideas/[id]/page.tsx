import { notFound } from 'next/navigation';

type IdeaDetail = {
  id: string;
  title: string;
  content: string;
};

// Ambil data awal dari getInitialIdeas
export async function getInitialIdeas(): Promise<{ ideas: IdeaDetail[]; total: number }> {
  let allIdeas: IdeaDetail[] = [];
  let page = 1;
  const pageSize = 100;

  while (true) {
    const res = await fetch(`https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${page}&page[size]=${pageSize}&append[]=small_image&append[]=medium_image&sort=-published_at`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      if (res.status === 422) {
        console.error('Unprocessable Entity error, stopping fetch:', res.statusText);
        break;
      }
      throw new Error(`Failed to fetch ideas for page ${page}: ${res.statusText}`);
    }

    const data = await res.json();
    if (data.data && Array.isArray(data.data)) {
      allIdeas = [...allIdeas, ...data.data];
    } else {
      break;
    }

    const total = data.meta?.total || 0;
    const lastPage = Math.ceil(total / pageSize);

    if (page >= lastPage || allIdeas.length >= total) break;
    page++;
  }

  return { ideas: allIdeas, total: allIdeas.length };
}

export default async function IdeaPage({ params }: { params: { id: string } }) {
  const { ideas } = await getInitialIdeas(); // Ambil semua data di sini
  const idea = ideas.find((item) => item.id === params.id);

  if (!idea) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{idea.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: idea.content }} />
    </div>
  );
}
