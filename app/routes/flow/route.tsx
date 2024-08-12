import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  BackgroundVariant,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useLoaderData } from '@remix-run/react';

import type { loader, NormalisedEdge, NormalisedNode } from './loader.server';
export { loader } from './loader.server';

// type Node = {
//   id: string;
//   position: { x: number; y: number };
//   data: { label: string };
// };

// const initialNodes: Node[] = [
//   { id: '1', position: { x: 100, y: 100 }, data: { label: '1' } },
//   { id: '2', position: { x: 100, y: 200 }, data: { label: '2' } },
// ];
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function Flow() {
  const { nodes: initialNodes, edges: initialEdges } =
    useLoaderData<typeof loader>();

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange<NormalisedNode>[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<NormalisedEdge>[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
