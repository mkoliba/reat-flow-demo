import { Handle, Position } from '@xyflow/react';
import type { NormalisedNode } from '../loader.server';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { EllipsisVerticalIcon } from 'lucide-react';
import { useFlowDispatchContext } from '../state/context';
import { ActionType } from '../state/types';

export const CustomNode = ({ id, data }: Omit<NormalisedNode, 'position'>) => {
  const dispatch = useFlowDispatchContext();
  return (
    <>
      <div className="flex justify-between">
        <div>{data.label}</div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVerticalIcon className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem
              className="gap-2 text-base font-normal"
              onClick={() =>
                dispatch({ type: ActionType.deleteNode, payload: id })
              }
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Handle type="target" position={Position.Left} />

      <Handle type="source" position={Position.Right} />
    </>
  );
};
