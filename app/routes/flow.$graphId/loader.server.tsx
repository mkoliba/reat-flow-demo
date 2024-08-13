import type { Edge, Node } from '@prisma/client';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zx } from 'zodix';
import { db } from '~/db.server';

const normalizeNode = (node: Node) => ({
  id: node.id,
  position: { x: node.positionX, y: node.positionY },
  data: { label: node.label },
});

const normaliseEdge = (edge: Edge) => ({
  id: edge.id,
  source: edge.sourceId,
  target: edge.targetId,
});

export type NormalisedNode = ReturnType<typeof normalizeNode>;
export type NormalisedEdge = ReturnType<typeof normaliseEdge>;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { graphId } = zx.parseParams(params, { graphId: z.string() });
  const graph = await db.graph.findFirst({
    where: { id: graphId },
    include: {
      nodes: true,
      edges: true,
    },
  });

  invariant(graph != null, 'Graph not found');

  return json({
    nodes: graph.nodes.map(normalizeNode),
    edges: graph.edges.map(normaliseEdge),
  });
};
