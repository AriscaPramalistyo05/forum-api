import KomentarDibuat from '../KomentarDibuat.js';

describe('KomentarDibuat entity', () => {
  it('harus throw error saat properti kurang', () => {
    expect(() => new KomentarDibuat({ id: 'comment-123', content: 'isi' })).toThrow('KOMENTAR_DIBUAT.KURANG_PROPERTI');
  });

  it('harus throw error saat tipe data salah', () => {
    expect(() => new KomentarDibuat({ id: 123, content: 'isi', owner: 'user-123' })).toThrow('KOMENTAR_DIBUAT.TIPE_DATA_SALAH');
  });

  it('harus berhasil membuat objek KomentarDibuat', () => {
    const komentar = new KomentarDibuat({ id: 'comment-123', content: 'isi', owner: 'user-123' });
    expect(komentar.id).toBe('comment-123');
    expect(komentar.content).toBe('isi');
    expect(komentar.owner).toBe('user-123');
  });
});
