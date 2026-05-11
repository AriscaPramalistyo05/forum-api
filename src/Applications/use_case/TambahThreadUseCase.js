import BikinThread from '../../Domains/threads/entities/BikinThread.js';

class TambahThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const bikinThread = new BikinThread(useCasePayload);
    return this._threadRepository.tambahThread(bikinThread);
  }
}

export default TambahThreadUseCase;
