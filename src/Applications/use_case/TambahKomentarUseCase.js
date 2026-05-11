import BikinKomentar from '../../Domains/komentar/entities/BikinKomentar.js';

class TambahKomentarUseCase {
  constructor({ komentarRepository, threadRepository }) {
    this._komentarRepository = komentarRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const bikinKomentar = new BikinKomentar(useCasePayload);
    await this._threadRepository.cekThreadAda(bikinKomentar.threadId);
    return this._komentarRepository.tambahKomentar(bikinKomentar);
  }
}

export default TambahKomentarUseCase;
