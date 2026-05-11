import HapusKomentarUseCase from "../HapusKomentarUseCase.js";
import KomentarRepository from "../../../Domains/komentar/KomentarRepository.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";
import AuthorizationError from "../../../Commons/exceptions/AuthorizationError.js";

describe("HapusKomentarUseCase", () => {
  const payload = {
    threadId: "thread-123",
    commentId: "comment-123",
    owner: "user-123",
  };

  const buatMock = () => {
    const mockKomentarRepository = new KomentarRepository();
    mockKomentarRepository.ambilPemilikKomentar = vi
      .fn()
      .mockResolvedValue("user-123");
    mockKomentarRepository.hapusKomentar = vi.fn().mockResolvedValue();

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.cekThreadAda = vi.fn().mockResolvedValue();

    return { mockKomentarRepository, mockThreadRepository };
  };

  it("harus berhasil menghapus komentar", async () => {
    const { mockKomentarRepository, mockThreadRepository } = buatMock();
    const useCase = new HapusKomentarUseCase({
      komentarRepository: mockKomentarRepository,
      threadRepository: mockThreadRepository,
    });

    await useCase.execute(payload);

    expect(mockThreadRepository.cekThreadAda).toHaveBeenCalledWith(
      "thread-123",
    );
    expect(mockKomentarRepository.ambilPemilikKomentar).toHaveBeenCalledWith(
      "comment-123",
    );
    expect(mockKomentarRepository.hapusKomentar).toHaveBeenCalledWith(
      "comment-123",
    );
  });

  it("harus throw NotFoundError saat thread tidak ada", async () => {
    const { mockKomentarRepository, mockThreadRepository } = buatMock();
    mockThreadRepository.cekThreadAda = vi
      .fn()
      .mockRejectedValue(new NotFoundError("thread tidak ditemukan"));

    const useCase = new HapusKomentarUseCase({
      komentarRepository: mockKomentarRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(useCase.execute(payload)).rejects.toThrow(NotFoundError);
    expect(mockKomentarRepository.ambilPemilikKomentar).not.toHaveBeenCalled();
  });

  it("harus throw NotFoundError saat komentar tidak ada", async () => {
    const { mockKomentarRepository, mockThreadRepository } = buatMock();
    mockKomentarRepository.ambilPemilikKomentar = vi
      .fn()
      .mockRejectedValue(new NotFoundError("komentar tidak ditemukan"));

    const useCase = new HapusKomentarUseCase({
      komentarRepository: mockKomentarRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(useCase.execute(payload)).rejects.toThrow(NotFoundError);
    expect(mockKomentarRepository.ambilPemilikKomentar).toHaveBeenCalledWith(
      "comment-123",
    );
    expect(mockKomentarRepository.hapusKomentar).not.toHaveBeenCalled();
  });

  it("harus throw AuthorizationError saat bukan pemilik komentar", async () => {
    const { mockKomentarRepository, mockThreadRepository } = buatMock();
    // mock return owner berbeda dari payload.owner
    mockKomentarRepository.ambilPemilikKomentar = vi
      .fn()
      .mockResolvedValue("user-lain");

    const useCase = new HapusKomentarUseCase({
      komentarRepository: mockKomentarRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(useCase.execute(payload)).rejects.toThrow(AuthorizationError);
    expect(mockThreadRepository.cekThreadAda).toHaveBeenCalledWith(
      "thread-123",
    );
    expect(mockKomentarRepository.ambilPemilikKomentar).toHaveBeenCalledWith(
      "comment-123",
    );
    expect(mockKomentarRepository.hapusKomentar).not.toHaveBeenCalled();
  });
});
