import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seed() {
  // only run seed on empty db
  const existingOrgs = await db.graph.findMany();
  if (existingOrgs.length) {
    // eslint-disable-next-line no-console
    console.log('Not performing db seed, db is already populated');
    return;
  }
  // Create the graph
  const graph = await db.graph.create({
    data: {
      name: 'First flow',
    },
  });

  // Create nodes
  const node1 = await db.node.create({
    data: {
      positionX: 0,
      positionY: 0,
      label: 'Node 1',
      graphId: graph.id,
    },
  });

  const node2 = await db.node.create({
    data: {
      positionX: 100,
      positionY: 100,
      label: 'Node 2',
      graphId: graph.id,
    },
  });

  // Create an edge connecting the nodes
  await db.edge.create({
    data: {
      graphId: graph.id,
      sourceId: node1.id,
      targetId: node2.id,
    },
  });
}

// Run the seed function
void seed();
