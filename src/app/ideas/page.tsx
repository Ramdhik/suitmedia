import { getInitialIdeas } from './getInitialIdeas';
import IdeasPage from './IdeasPage';

export default async function Page() {
  const { ideas, total } = await getInitialIdeas();
  return <IdeasPage initialIdeas={ideas} total={total} />;
}
