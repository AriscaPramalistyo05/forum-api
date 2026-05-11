import TambahThreadUseCase from "../TambahThreadUseCase.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";

describe("TambahThreadUseCase", () => {
  it("harus berhasil mengeksekusi tambah thread", async () => {
    const payload = {
      title: "sebuah thread",
      body: "isi thread",
      owner: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockReturnValue = {
      id: "thread-xyz",
      title: "mock title",
      owner: "user-mock",
    };
    const expectedAddedThread = {
      id: "thread-xyz",
      title: "mock title",
      owner: "user-mock",
    };
    mockThreadRepository.tambahThread = vi
      .fn()
      .mockResolvedValue(mockReturnValue);

    const useCase = new TambahThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    const result = await useCase.execute(payload);

    expect(mockThreadRepository.tambahThread).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "sebuah thread",
        body: "isi thread",
        owner: "user-123",
      }),
    );
    expect(result).toStrictEqual(expectedAddedThread);
  });
});
