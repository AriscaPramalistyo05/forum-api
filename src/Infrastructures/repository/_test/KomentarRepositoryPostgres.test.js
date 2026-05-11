import pool from "../../database/postgres/pool.js";
import KomentarRepositoryPostgres from "../KomentarRepositoryPostgres.js";
import KomentarDibuat from "../../../Domains/komentar/entities/KomentarDibuat.js";
import BikinKomentar from "../../../Domains/komentar/entities/BikinKomentar.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";

describe("KomentarRepositoryPostgres", () => {
  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe("tambahKomentar", () => {
    it("harus berhasil menyimpan komentar dan mengembalikan KomentarDibuat", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });

      const bikinKomentar = new BikinKomentar({
        content: "sebuah komentar",
        threadId: "thread-123",
        owner: "user-123",
      });
      const repo = new KomentarRepositoryPostgres(pool, () => "123");

      const result = await repo.tambahKomentar(bikinKomentar);

      // verifikasi return value
      expect(result).toBeInstanceOf(KomentarDibuat);
      expect(result.id).toBe("comment-123");
      expect(result.content).toBe("sebuah komentar");
      expect(result.owner).toBe("user-123");

      // kriteria 4: verifikasi data benar-benar tersimpan di database
      const [tersimpan] =
        await CommentsTableTestHelper.findCommentById("comment-123");
      expect(tersimpan).toBeDefined();
      expect(tersimpan.content).toBe("sebuah komentar");
      expect(tersimpan.owner).toBe("user-123");
    });
  });

  describe("ambilPemilikKomentar", () => {
    it("harus mengembalikan owner komentar", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });

      const repo = new KomentarRepositoryPostgres(pool, () => "123");
      const owner = await repo.ambilPemilikKomentar("comment-123");

      expect(owner).toBe("user-123");
    });

    it("harus throw NotFoundError saat komentar tidak ada", async () => {
      const repo = new KomentarRepositoryPostgres(pool, () => "123");
      await expect(
        repo.ambilPemilikKomentar("comment-tidak-ada"),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("hapusKomentar", () => {
    it("harus soft delete komentar (set is_delete = true)", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });

      const repo = new KomentarRepositoryPostgres(pool, () => "123");
      await repo.hapusKomentar("comment-123");

      const [komentar] =
        await CommentsTableTestHelper.findCommentById("comment-123");
      expect(komentar.is_delete).toBe(true);
    });
  });

  describe("ambilKomentarByThreadId", () => {
    it("harus mengembalikan komentar dengan konten asli jika tidak dihapus", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: "isi komentar",
        owner: "user-123",
        isDelete: false,
      });

      const repo = new KomentarRepositoryPostgres(pool, () => "123");
      const result = await repo.ambilKomentarByThreadId("thread-123");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("comment-123");
      expect(result[0].username).toBe("dicoding");
      expect(result[0].content).toBe("isi komentar");
      expect(result[0].date).toBeDefined();
    });

    it("harus mengembalikan komentar mentah dengan flag is_delete true", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: "isi komentar",
        owner: "user-123",
        isDelete: true,
      });

      const repo = new KomentarRepositoryPostgres(pool, () => "123");
      const result = await repo.ambilKomentarByThreadId("thread-123");

      expect(result[0].id).toBe("comment-123");
      expect(result[0].content).toBe("isi komentar");
      expect(result[0].is_delete).toBe(true);
    });

    it("harus mengembalikan array kosong jika tidak ada komentar", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });

      const repo = new KomentarRepositoryPostgres(pool, () => "123");
      const result = await repo.ambilKomentarByThreadId("thread-123");

      expect(result).toHaveLength(0);
    });
  });
});
