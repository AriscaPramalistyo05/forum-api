import ThreadRepository from '../ThreadRepository.js';

describe('ThreadRepository', () => {
  it('harus throw error saat tambahThread dipanggil', async () => {
    const repo = new ThreadRepository();
    await expect(repo.tambahThread({})).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('harus throw error saat cekThreadAda dipanggil', async () => {
    const repo = new ThreadRepository();
    await expect(repo.cekThreadAda('thread-123')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('harus throw error saat ambilDetailThread dipanggil', async () => {
    const repo = new ThreadRepository();
    await expect(repo.ambilDetailThread('thread-123')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
