import KomentarRepository from "../../Domains/komentar/KomentarRepository.js";
import KomentarDibuat from "../../Domains/komentar/entities/KomentarDibuat.js";
import NotFoundError from "../../Commons/exceptions/NotFoundError.js";

class KomentarRepositoryPostgres extends KomentarRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async tambahKomentar(bikinKomentar) {
    const { content, threadId, owner } = bikinKomentar;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, content, threadId, owner],
    };

    const result = await this._pool.query(query);
    return new KomentarDibuat({ ...result.rows[0] });
  }

  async ambilPemilikKomentar(commentId) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan");
    }

    return result.rows[0].owner;
  }

  async hapusKomentar(commentId) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1",
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async ambilKomentarByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c.content, c.is_delete
             FROM comments c
             JOIN users u ON c.owner = u.id
             WHERE c.thread_id = $1
             ORDER BY c.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

export default KomentarRepositoryPostgres;
