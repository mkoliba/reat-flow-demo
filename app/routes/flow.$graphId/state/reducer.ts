import { addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import type { NormalisedEdge, NormalisedNode } from '../loader.server';
import { ActionType, type ReducerAction, type ReducerState } from './types';

export function initReducer({
  nodes,
  edges,
}: {
  nodes: NormalisedNode[];
  edges: NormalisedEdge[];
}): ReducerState {
  return {
    nodes,
    edges,
    unsaved: false,
  };
}

export function reducer(
  state: ReducerState,
  action: ReducerAction
): ReducerState {
  switch (action.type) {
    case ActionType.deleteNode: {
      const { payload: nodeId } = action;
      return {
        ...state,
        unsaved: true,
        nodes: [...state.nodes.filter((node) => node.id !== nodeId)],
        edges: [
          ...state.edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
          ),
        ],
      };
    }
    case ActionType.nodeChanges:
      return {
        ...state,
        unsaved: true,
        nodes: applyNodeChanges(action.payload, state.nodes),
      };
    case ActionType.edgeChanges: {
      const { payload: changes } = action;

      return {
        ...state,
        unsaved: true,

        edges: applyEdgeChanges(changes, state.edges),
      };
    }
    case ActionType.connect:
      return {
        ...state,
        unsaved: true,
        edges: addEdge(action.payload, state.edges),
      };
    case ActionType.addNodes: {
      const {
        payload: { nodes, edges },
      } = action;
      return {
        ...state,
        unsaved: true,
        nodes: [...state.nodes, ...nodes],
        edges: edges ? [...state.edges, ...edges] : state.edges,
      };
    }
  }
}
