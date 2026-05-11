import UserRepository from '../../../Domains/users/UserRepository.js';
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager.js';
import PasswordHash from '../../security/PasswordHash.js';
import LoginUserUseCase from '../LoginUserUseCase.js';
import NewAuth from '../../../Domains/authentications/entities/NewAuth.js';

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };

    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    // Mocking
    mockUserRepository.getPasswordByUsername = vi.fn().mockResolvedValue('encrypted_password');
    mockPasswordHash.comparePassword = vi.fn().mockResolvedValue();
    mockAuthenticationTokenManager.createAccessToken = vi.fn().mockResolvedValue('mock_access_token');
    mockAuthenticationTokenManager.createRefreshToken = vi.fn().mockResolvedValue('mock_refresh_token');
    mockUserRepository.getIdByUsername = vi.fn().mockResolvedValue('user-123');
    mockAuthenticationRepository.addToken = vi.fn().mockResolvedValue();

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toEqual(new NewAuth({
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
    }));
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith('dicoding');
    expect(mockPasswordHash.comparePassword).toBeCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getIdByUsername).toBeCalledWith('dicoding');
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationRepository.addToken).toBeCalledWith('mock_refresh_token');
  });
});
