import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  type NodeChange,
  type EdgeChange,
  type Connection,
  BackgroundVariant,
  useReactFlow,
  type OnConnectStartParams,
} from '@xyflow/react';

import { useFlowDispatchContext, useFlowStateContext } from '../state/context';
import { CustomNode } from './Node';
import type { NormalisedEdge, NormalisedNode } from '../loader.server';
import { ActionType } from '../state/types';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
  default: CustomNode,
};

export function Flow() {
  const { nodes, edges } = useFlowStateContext();
  const dispatch = useFlowDispatchContext();

  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange<NormalisedNode>[]) =>
      dispatch({ type: ActionType.nodeChanges, payload: changes }),
    [dispatch]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<NormalisedEdge>[]) =>
      dispatch({ type: ActionType.edgeChanges, payload: changes }),
    [dispatch]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      connectingNodeId.current = null;
      dispatch({ type: ActionType.connect, payload: params });
    },
    [dispatch]
  );

  const onConnectStart = useCallback(
    (event: MouseEvent | TouchEvent, params: OnConnectStartParams) => {
      connectingNodeId.current = params.nodeId;
    },
    []
  );

  const onConnectEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = uuidv4();
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
        };

        dispatch({
          type: ActionType.addNodes,
          payload: {
            nodes: [newNode],
            edges: [{ id, source: connectingNodeId.current, target: id }],
          },
        });
      }
    },
    [dispatch, screenToFlowPosition]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={[0.5, 0]}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
