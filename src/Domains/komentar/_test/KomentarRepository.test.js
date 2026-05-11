import KomentarRepository from '../KomentarRepository.js';

describe('KomentarRepository', () => {
  it('harus throw error saat tambahKomentar dipanggil', async () => {
    const repo = new KomentarRepository();
    await expect(repo.tambahKomentar({})).rejects.toThrow('KOMENTAR_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('harus throw error saat ambilPemilikKomentar dipanggil', async () => {
    const repo = new KomentarRepository();
    await expect(repo.ambilPemilikKomentar('comment-123')).rejects.toThrow('KOMENTAR_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('harus throw error saat hapusKomentar dipanggil', async () => {
    const repo = new KomentarRepository();
    await expect(repo.hapusKomentar('comment-123')).rejects.toThrow('KOMENTAR_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('harus throw error saat ambilKomentarByThreadId dipanggil', async () => {
    const repo = new KomentarRepository();
    await expect(repo.ambilKomentarByThreadId('thread-123')).rejects.toThrow('KOMENTAR_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
