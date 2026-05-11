import TambahThreadUseCase from '../../../../Applications/use_case/TambahThreadUseCase.js';
import TambahKomentarUseCase from '../../../../Applications/use_case/TambahKomentarUseCase.js';
import HapusKomentarUseCase from '../../../../Applications/use_case/HapusKomentarUseCase.js';
import LihatDetailThreadUseCase from '../../../../Applications/use_case/LihatDetailThreadUseCase.js';

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postKomentarHandler = this.postKomentarHandler.bind(this);
    this.deleteKomentarHandler = this.deleteKomentarHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async postThreadHandler(req, res, next) {
    try {
      const { id: owner } = req.user;
      const useCase = this._container.getInstance(TambahThreadUseCase.name);
      const addedThread = await useCase.execute({ ...req.body, owner });

      res.status(201).json({
        status: 'success',
        data: { addedThread },
      });
    } catch (error) {
      next(error);
    }
  }

  async postKomentarHandler(req, res, next) {
    try {
      const { id: owner } = req.user;
      const { threadId } = req.params;
      const useCase = this._container.getInstance(TambahKomentarUseCase.name);
      const addedComment = await useCase.execute({ ...req.body, threadId, owner });

      res.status(201).json({
        status: 'success',
        data: { addedComment },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteKomentarHandler(req, res, next) {
    try {
      const { id: owner } = req.user;
      const { threadId, commentId } = req.params;
      const useCase = this._container.getInstance(HapusKomentarUseCase.name);
      await useCase.execute({ threadId, commentId, owner });

      res.json({ status: 'success' });
    } catch (error) {
      next(error);
    }
  }

  async getDetailThreadHandler(req, res, next) {
    try {
      const { threadId } = req.params;
      const useCase = this._container.getInstance(LihatDetailThreadUseCase.name);
      const thread = await useCase.execute(threadId);

      res.json({
        status: 'success',
        data: { thread },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ThreadsHandler;
