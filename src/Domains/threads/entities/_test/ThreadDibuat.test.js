import ThreadDibuat from '../ThreadDibuat.js';

describe('ThreadDibuat entity', () => {
  it('harus throw error saat properti kurang', () => {
    expect(() => new ThreadDibuat({ id: 'thread-123', title: 'judul' })).toThrow('THREAD_DIBUAT.KURANG_PROPERTI');
  });

  it('harus throw error saat tipe data salah', () => {
    expect(() => new ThreadDibuat({ id: 123, title: 'judul', owner: 'user-123' })).toThrow('THREAD_DIBUAT.TIPE_DATA_SALAH');
  });

  it('harus berhasil membuat objek ThreadDibuat', () => {
    const thread = new ThreadDibuat({ id: 'thread-123', title: 'judul', owner: 'user-123' });
    expect(thread.id).toBe('thread-123');
    expect(thread.title).toBe('judul');
    expect(thread.owner).toBe('user-123');
  });
});
