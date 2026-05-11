import express from 'express';

const buatThreadsRouter = (handler, authMiddleware) => {
  const router = express.Router();

  router.post('/', authMiddleware, handler.postThreadHandler);
  router.get('/:threadId', handler.getDetailThreadHandler);
  router.post('/:threadId/comments', authMiddleware, handler.postKomentarHandler);
  router.delete('/:threadId/comments/:commentId', authMiddleware, handler.deleteKomentarHandler);

  return router;
};

export default buatThreadsRouter;
