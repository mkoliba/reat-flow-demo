import type { MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import type { loader } from './loader.server';

export { loader } from './loader.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  const { graphs } = useLoaderData<typeof loader>();
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">React flow demo</h1>
      {graphs.length > 0 ? (
        <ul className="list-disc mt-4 pl-6 space-y-2">
          {graphs.map((graph) => (
            <li key={graph.id}>
              <Link
                className="text-blue-700 underline visited:text-purple-900"
                to={`/flow/${graph.id}`}
              >
                {graph.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        'No graphs found'
      )}
    </div>
  );
}
