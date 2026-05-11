import TambahKomentarUseCase from "../TambahKomentarUseCase.js";
import KomentarRepository from "../../../Domains/komentar/KomentarRepository.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";

describe("TambahKomentarUseCase", () => {
  it("harus berhasil mengeksekusi tambah komentar", async () => {
    const payload = {
      content: "sebuah komentar",
      threadId: "thread-123",
      owner: "user-123",
    };

    const mockKomentarRepository = new KomentarRepository();
    const mockReturnValue = {
      id: "comment-xyz",
      content: "mock content",
      owner: "user-mock",
    };
    const expectedAddedComment = {
      id: "comment-xyz",
      content: "mock content",
      owner: "user-mock",
    };
    mockKomentarRepository.tambahKomentar = vi
      .fn()
      .mockResolvedValue(mockReturnValue);

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.cekThreadAda = vi.fn().mockResolvedValue();

    const useCase = new TambahKomentarUseCase({
      komentarRepository: mockKomentarRepository,
      threadRepository: mockThreadRepository,
    });

    const result = await useCase.execute(payload);

    expect(mockThreadRepository.cekThreadAda).toHaveBeenCalledWith(
      "thread-123",
    );
    expect(mockKomentarRepository.tambahKomentar).toHaveBeenCalledWith(
      expect.objectContaining({
        content: "sebuah komentar",
        threadId: "thread-123",
        owner: "user-123",
      }),
    );
    expect(result).toStrictEqual(expectedAddedComment);
  });

  it("harus throw NotFoundError saat thread tidak ada", async () => {
    const payload = {
      content: "sebuah komentar",
      threadId: "thread-tidak-ada",
      owner: "user-123",
    };

    const mockKomentarRepository = new KomentarRepository();
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.cekThreadAda = vi
      .fn()
      .mockRejectedValue(new NotFoundError("thread tidak ditemukan"));

    const useCase = new TambahKomentarUseCase({
      komentarRepository: mockKomentarRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(useCase.execute(payload)).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.cekThreadAda).toHaveBeenCalledWith(
      "thread-tidak-ada",
    );
  });
});
