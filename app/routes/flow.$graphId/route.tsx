import { ReactFlowProvider } from '@xyflow/react';

import { useLoaderData } from '@remix-run/react';

import type { loader } from './loader.server';
import { ReducerProvider } from './state/context';
import { Flow } from './view/Flow';
import { Panel } from './view/Panel';
export { loader } from './loader.server';
export { action } from './action.server';

export default function FlowPage() {
  const { nodes: initialNodes, edges: initialEdges } =
    useLoaderData<typeof loader>();

  return (
    <ReducerProvider initialNodes={initialNodes} initialEdges={initialEdges}>
      <ReactFlowProvider>
        <Panel />
        <div className="w-screen h-[calc(100hv-5rem)]">
          <Flow />
        </div>
      </ReactFlowProvider>
    </ReducerProvider>
  );
}
