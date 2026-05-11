import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import ThreadDibuat from '../../Domains/threads/entities/ThreadDibuat.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async tambahThread(bikinThread) {
    const { title, body, owner } = bikinThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);
    return new ThreadDibuat({ ...result.rows[0] });
  }

  async cekThreadAda(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async ambilDetailThread(threadId) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date, u.username
             FROM threads t
             JOIN users u ON t.owner = u.id
             WHERE t.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return result.rows[0];
  }
}

export default ThreadRepositoryPostgres;
