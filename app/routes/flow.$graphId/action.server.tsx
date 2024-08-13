import { json, type ActionFunctionArgs } from '@remix-run/node';
import { z } from 'zod';
import { zx } from 'zodix';
import { db } from '~/db.server';

const schema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }),
      data: z.object({
        label: z.string(),
      }),
    })
  ),
  edges: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      target: z.string(),
    })
  ),
});

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { graphId } = zx.parseParams(params, { graphId: z.string() });

  const requestBody = await request.json();
  const result = schema.safeParse(requestBody);
  if (result.error) {
    console.error(result.error);
    return json(result.error, { status: 400 });
  }

  await db.graph.update({
    where: { id: graphId },
    data: {
      nodes: {
        updateMany: result.data.nodes.map(({ id, data, position }) => ({
          where: { id },
          data: {
            label: data.label,
            positionX: position.x,
            positionY: position.y,
          },
        })),
      },
      edges: {
        updateMany: result.data.edges.map(({ id, source, target }) => ({
          where: { id },
          data: { sourceId: source, targetId: target },
        })),
      },
    },
  });

  return json({ status: 'ok' }, { status: 200 });
};
