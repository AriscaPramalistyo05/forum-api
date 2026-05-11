import BikinKomentar from '../BikinKomentar.js';

describe('BikinKomentar entity', () => {
  it('harus throw error saat properti kurang', () => {
    expect(() => new BikinKomentar({ content: 'isi', threadId: 'thread-123' })).toThrow('BIKIN_KOMENTAR.KURANG_PROPERTI');
    expect(() => new BikinKomentar({ content: 'isi', owner: 'user-123' })).toThrow('BIKIN_KOMENTAR.KURANG_PROPERTI');
    expect(() => new BikinKomentar({ threadId: 'thread-123', owner: 'user-123' })).toThrow('BIKIN_KOMENTAR.KURANG_PROPERTI');
  });

  it('harus throw error saat tipe data salah', () => {
    expect(() => new BikinKomentar({ content: 123, threadId: 'thread-123', owner: 'user-123' })).toThrow('BIKIN_KOMENTAR.TIPE_DATA_SALAH');
    expect(() => new BikinKomentar({ content: 'isi', threadId: [], owner: 'user-123' })).toThrow('BIKIN_KOMENTAR.TIPE_DATA_SALAH');
  });

  it('harus berhasil membuat objek BikinKomentar', () => {
    const komentar = new BikinKomentar({ content: 'isi', threadId: 'thread-123', owner: 'user-123' });
    expect(komentar.content).toBe('isi');
    expect(komentar.threadId).toBe('thread-123');
    expect(komentar.owner).toBe('user-123');
  });
});
