import BikinThread from '../BikinThread.js';

describe('BikinThread entity', () => {
  it('harus throw error saat properti kurang', () => {
    expect(() => new BikinThread({ title: 'judul', body: 'isi' })).toThrow('BIKIN_THREAD.KURANG_PROPERTI');
    expect(() => new BikinThread({ title: 'judul', owner: 'user-123' })).toThrow('BIKIN_THREAD.KURANG_PROPERTI');
    expect(() => new BikinThread({ body: 'isi', owner: 'user-123' })).toThrow('BIKIN_THREAD.KURANG_PROPERTI');
  });

  it('harus throw error saat tipe data salah', () => {
    expect(() => new BikinThread({ title: 123, body: 'isi', owner: 'user-123' })).toThrow('BIKIN_THREAD.TIPE_DATA_SALAH');
    expect(() => new BikinThread({ title: 'judul', body: [], owner: 'user-123' })).toThrow('BIKIN_THREAD.TIPE_DATA_SALAH');
  });

  it('harus berhasil membuat objek BikinThread', () => {
    const thread = new BikinThread({ title: 'judul', body: 'isi', owner: 'user-123' });
    expect(thread.title).toBe('judul');
    expect(thread.body).toBe('isi');
    expect(thread.owner).toBe('user-123');
  });
});
