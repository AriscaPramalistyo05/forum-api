import ThreadsHandler from './handler.js';
import buatThreadsRouter from './routes.js';

export default (container, authMiddleware) => {
  const handler = new ThreadsHandler(container);
  return buatThreadsRouter(handler, authMiddleware);
};
