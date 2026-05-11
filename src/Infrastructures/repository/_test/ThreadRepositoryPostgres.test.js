import pool from '../../database/postgres/pool.js';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';
import ThreadDibuat from '../../../Domains/threads/entities/ThreadDibuat.js';
import BikinThread from '../../../Domains/threads/entities/BikinThread.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('ThreadRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('tambahThread', () => {
    it('harus berhasil menyimpan thread dan mengembalikan ThreadDibuat', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      const bikinThread = new BikinThread({ title: 'sebuah thread', body: 'isi thread', owner: 'user-123' });
      const repo = new ThreadRepositoryPostgres(pool, () => '123');

      const result = await repo.tambahThread(bikinThread);

      // verifikasi return value
      expect(result).toBeInstanceOf(ThreadDibuat);
      expect(result.id).toBe('thread-123');
      expect(result.title).toBe('sebuah thread');
      expect(result.owner).toBe('user-123');

      // verifikasi data benar-benar tersimpan di database
      const [tersimpan] = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(tersimpan).toBeDefined();
      expect(tersimpan.title).toBe('sebuah thread');
      expect(tersimpan.body).toBe('isi thread');
      expect(tersimpan.owner).toBe('user-123');
    });
  });

  describe('cekThreadAda', () => {
    it('harus tidak throw error saat thread ditemukan', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const repo = new ThreadRepositoryPostgres(pool, () => '123');
      await expect(repo.cekThreadAda('thread-123')).resolves.not.toThrow();
    });

    it('harus throw NotFoundError saat thread tidak ditemukan', async () => {
      const repo = new ThreadRepositoryPostgres(pool, () => '123');
      await expect(repo.cekThreadAda('thread-tidak-ada')).rejects.toThrow(NotFoundError);
    });
  });

  describe('ambilDetailThread', () => {
    it('harus mengembalikan detail thread dengan username', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const repo = new ThreadRepositoryPostgres(pool, () => '123');
      const result = await repo.ambilDetailThread('thread-123');

      expect(result.id).toBe('thread-123');
      expect(result.title).toBe('sebuah thread');
      expect(result.body).toBe('isi thread');
      expect(result.username).toBe('dicoding');
      expect(result.date).toBeDefined();
    });

    it('harus throw NotFoundError saat thread tidak ada', async () => {
      const repo = new ThreadRepositoryPostgres(pool, () => '123');
      await expect(repo.ambilDetailThread('thread-tidak-ada')).rejects.toThrow(NotFoundError);
    });
  });
});
