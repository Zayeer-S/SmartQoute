import serverless from 'serverless-http';
import { bootstrapApplication } from './app.bootstrap.js';

let cachedHandler: ReturnType<typeof serverless> | null = null;

async function getHandler(): Promise<ReturnType<typeof serverless>> {
  if (cachedHandler) return cachedHandler;

  const app = await bootstrapApplication({ runBackgroundJobs: false });
  cachedHandler = serverless(app);

  return cachedHandler;
}

export const handler = async (
  event: Parameters<ReturnType<typeof serverless>>[0],
  context: Parameters<ReturnType<typeof serverless>>[1]
) => {
  const h = await getHandler();
  return h(event, context);
};
