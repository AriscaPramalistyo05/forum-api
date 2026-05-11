import LihatDetailThreadUseCase from '../LihatDetailThreadUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import KomentarRepository from '../../../Domains/komentar/KomentarRepository.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('LihatDetailThreadUseCase', () => {
  it('harus berhasil mengembalikan detail thread beserta komentar', async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.ambilDetailThread = vi.fn().mockResolvedValue({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi thread',
      date: new Date('2021-08-08T07:19:09.775Z'),
      username: 'dicoding',
    });

    const mockKomentarRepository = new KomentarRepository();
    mockKomentarRepository.ambilKomentarByThreadId = vi.fn().mockResolvedValue([
      { id: 'comment-1', username: 'johndoe', date: new Date('2021-08-08T07:22:33.555Z'), content: 'sebuah comment', is_delete: false },
      { id: 'comment-2', username: 'dicoding', date: new Date('2021-08-08T07:26:21.338Z'), content: 'isi asli', is_delete: true },
    ]);

    const useCase = new LihatDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      komentarRepository: mockKomentarRepository,
    });

    const result = await useCase.execute('thread-123');

    expect(mockThreadRepository.ambilDetailThread).toHaveBeenCalledWith('thread-123');
    expect(mockKomentarRepository.ambilKomentarByThreadId).toHaveBeenCalledWith('thread-123');
    expect(result).toEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi thread',
      date: new Date('2021-08-08T07:19:09.775Z'),
      username: 'dicoding',
      comments: [
        { id: 'comment-1', username: 'johndoe', date: new Date('2021-08-08T07:22:33.555Z'), content: 'sebuah comment' },
        { id: 'comment-2', username: 'dicoding', date: new Date('2021-08-08T07:26:21.338Z'), content: '**komentar telah dihapus**' },
      ],
    });
  });

  it('harus throw NotFoundError saat thread tidak ada', async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.ambilDetailThread = vi.fn().mockRejectedValue(new NotFoundError('thread tidak ditemukan'));

    const mockKomentarRepository = new KomentarRepository();
    mockKomentarRepository.ambilKomentarByThreadId = vi.fn();

    const useCase = new LihatDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      komentarRepository: mockKomentarRepository,
    });

    await expect(useCase.execute('thread-tidak-ada')).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.ambilDetailThread).toHaveBeenCalledWith('thread-tidak-ada');
    expect(mockKomentarRepository.ambilKomentarByThreadId).not.toHaveBeenCalled();
  });
});
