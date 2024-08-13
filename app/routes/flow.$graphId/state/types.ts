import type { Connection, EdgeChange, NodeChange } from '@xyflow/react';
import type { NormalisedEdge, NormalisedNode } from '../loader.server';

export const ActionType = {
  addNodes: 'addNodes',
  deleteNode: 'deleteNode',
  nodeChanges: 'nodeChanges',
  edgeChanges: 'edgeChanges',
  connect: 'connect',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export type BaseAction<Type extends ActionType, Payload> = {
  type: Type;
  payload: Payload;
};

export type ReducerAction =
  // | BaseAction<typeof ActionType.createNode, TodoData>
  | BaseAction<typeof ActionType.nodeChanges, NodeChange<NormalisedNode>[]>
  | BaseAction<typeof ActionType.edgeChanges, EdgeChange<NormalisedEdge>[]>
  | BaseAction<typeof ActionType.connect, Connection>
  | BaseAction<typeof ActionType.deleteNode, string>
  | BaseAction<
      typeof ActionType.addNodes,
      { nodes: NormalisedNode[]; edges?: NormalisedEdge[] }
    >;

export type ReducerState = {
  nodes: NormalisedNode[];
  edges: NormalisedEdge[];
  unsaved: boolean;
};
