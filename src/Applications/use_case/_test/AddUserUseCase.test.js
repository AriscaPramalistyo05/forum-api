import RegisterUser from "../../../Domains/users/entities/RegisterUser.js";
import RegisteredUser from "../../../Domains/users/entities/RegisteredUser.js";
import UserRepository from "../../../Domains/users/UserRepository.js";
import PasswordHash from "../../security/PasswordHash.js";
import AddUserUseCase from "../AddUserUseCase.js";

describe("AddUserUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add user action correctly", async () => {
    // Arrange
    const useCasePayload = {
      username: "dicoding",
      password: "test_password_123",
      fullname: "Dicoding Indonesia",
    };

    const mockRegisteredUser = new RegisteredUser({
      id: "user-xyz",
      username: "dicoding_mock",
      fullname: "Mock Fullname",
    });
    const expectedRegisteredUser = new RegisteredUser({
      id: "user-xyz",
      username: "dicoding_mock",
      fullname: "Mock Fullname",
    });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    /** mocking needed function */
    mockUserRepository.verifyAvailableUsername = vi.fn().mockResolvedValue();
    mockPasswordHash.hash = vi.fn().mockResolvedValue("encrypted_password");
    mockUserRepository.addUser = vi.fn().mockResolvedValue(mockRegisteredUser);

    /** creating use case instance */
    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await addUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(expectedRegisteredUser);

    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(
      "dicoding",
    );
    expect(mockPasswordHash.hash).toBeCalledWith("test_password_123");
    expect(mockUserRepository.addUser).toBeCalledWith(
      new RegisterUser({
        username: "dicoding",
        password: "encrypted_password",
        fullname: "Dicoding Indonesia",
      }),
    );
  });
});
