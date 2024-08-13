import { useOnSelectionChange, type Node } from '@xyflow/react';
import { useFlowDispatchContext, useFlowStateContext } from '../state/context';
import { ActionType } from '../state/types';
import { useCallback, useState } from 'react';

import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/button';
import { Form, useSubmit } from '@remix-run/react';

export function Panel() {
  const state = useFlowStateContext();
  const dispatch = useFlowDispatchContext();
  const [selectedNode, setSelectedNodes] = useState<Node | undefined>();

  const submit = useSubmit();

  // the passed handler has to be memoized, otherwise the hook will not work correctly
  const onChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    if (nodes.length !== 1) {
      setSelectedNodes(undefined);

      return;
    }
    setSelectedNodes(nodes[0]);
  }, []);

  useOnSelectionChange({
    onChange,
  });
  return (
    <div className="flex h-20 bg-background text-foreground content-center px-4 justify-between">
      <div className="flex gap-4">
        <div className="border-r h-full content-center pr-3">
          Number of nodes: {state.nodes.length}
        </div>
        {selectedNode == null ? null : (
          <>
            <form
              className="flex gap-2 items-center"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const node = state.nodes.find((n) => n.id === selectedNode.id);
                if (node == null) {
                  return;
                }
                dispatch({
                  type: ActionType.nodeChanges,
                  payload: [
                    {
                      id: selectedNode.id,
                      item: {
                        ...node,
                        data: {
                          ...node.data,
                          label: (formData.get('label') as string) ?? '',
                        },
                      },
                      type: 'replace',
                    },
                  ],
                });
              }}
            >
              <label className="" htmlFor="label">
                Label
              </label>
              <Input
                type="text"
                name="label"
                defaultValue={selectedNode.data.label as string}
                className="border border-foreground rounded p-1 leading-1"
              />
              <Button type="submit" variant={'outline'}>
                Rename
              </Button>
            </form>
          </>
        )}
      </div>
      <div className="flex items-center">
        {state.unsaved ? (
          <Form
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              submit(state, { method: 'POST', encType: 'application/json' });
            }}
          >
            <Button variant={'default'} type="submit">
              Save
            </Button>
          </Form>
        ) : null}
      </div>
    </div>
  );
}
