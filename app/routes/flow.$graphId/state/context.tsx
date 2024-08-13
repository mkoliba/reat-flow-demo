import React, {
  createContext,
  useReducer,
  type ReactNode,
  useContext,
} from 'react';
import { reducer, initReducer } from './reducer';
import type { ReducerState, ReducerAction } from './types';
import type { NormalisedEdge, NormalisedNode } from '../loader.server';

export const ReducerProvider = ({
  children,
  initialNodes,
  initialEdges,
}: {
  children: ReactNode;
  initialNodes: NormalisedNode[];
  initialEdges: NormalisedEdge[];
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    { nodes: initialNodes, edges: initialEdges },
    initReducer
  );

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const StateContext = createContext<ReducerState | undefined>(undefined);
export const DispatchContext = createContext<
  React.Dispatch<ReducerAction> | undefined
>(undefined);

export function useFlowStateContext() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      'useFlowStateContext must be used within a StateContext.Provider'
    );
  }
  return context;
}

export function useFlowDispatchContext() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error(
      'useFlowDispatchContext must be used within a DispatchContext.Provider'
    );
  }
  return context;
}
