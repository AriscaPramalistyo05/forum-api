import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';

class HapusKomentarUseCase {
  constructor({ komentarRepository, threadRepository }) {
    this._komentarRepository = komentarRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ threadId, commentId, owner }) {
    await this._threadRepository.cekThreadAda(threadId);
    const pemilik = await this._komentarRepository.ambilPemilikKomentar(commentId);
    if (pemilik !== owner) {
      throw new AuthorizationError('kamu bukan pemilik komentar ini');
    }
    await this._komentarRepository.hapusKomentar(commentId);
  }
}

export default HapusKomentarUseCase;
