'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Idea } from '@/types/idea';

type Props = {
  idea: Idea;
};

export default function IdeaCard({ idea }: Props) {
  const publishDate = new Date(idea.published_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });


  const saveIdeaToSessionStorage = () => {
    try {
      sessionStorage.setItem('selectedIdea', JSON.stringify(idea));

    } catch (error) {
      console.error(`Error saving idea ID ${idea.id} to sessionStorage:`, error);
    }
  };

  return (
    <Card className="overflow-hidden rounded-lg shadow hover:shadow-lg transition cursor-pointer" data-id={idea.id}>
      <Link href={`/ideas/${idea.id}`} passHref onClick={saveIdeaToSessionStorage}>


        {idea.medium_image[0]?.url && <Image src={idea.medium_image[0].url} alt={idea.title} width={400} height={250} className="w-full object-cover" />}
        <CardContent className="p-4">
          <p className="text-xs text-gray-500 mb-1">{publishDate.toUpperCase()}</p>
          <h2 className="text-base font-semibold">{idea.title}</h2>
        </CardContent>
      </Link>
    </Card>
  );
}
