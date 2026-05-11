import KomentarDetail from "../../Domains/komentar/entities/KomentarDetail.js";

class LihatDetailThreadUseCase {
  constructor({ threadRepository, komentarRepository }) {
    this._threadRepository = threadRepository;
    this._komentarRepository = komentarRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.ambilDetailThread(threadId);
    const rawComments =
      await this._komentarRepository.ambilKomentarByThreadId(threadId);

    const comments = rawComments.map(
      (comment) =>
        new KomentarDetail({
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: comment.content,
          isDelete: comment.is_delete,
        }),
    );

    return { ...thread, comments };
  }
}

export default LihatDetailThreadUseCase;
