import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager.js';
import RefreshAuthenticationUseCase from '../RefreshAuthenticationUseCase.js';

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    const useCasePayload = {};
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

    await expect(refreshAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if refresh token not string', async () => {
    const useCasePayload = { refreshToken: 1 };
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

    await expect(refreshAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the refresh authentication action correctly', async () => {
    const useCasePayload = { refreshToken: 'some_refresh_token' };
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockAuthenticationRepository.checkAvailabilityToken = vi.fn().mockResolvedValue();
    mockAuthenticationTokenManager.verifyRefreshToken = vi.fn().mockResolvedValue();
    mockAuthenticationTokenManager.decodePayload = vi.fn().mockResolvedValue({ username: 'dicoding', id: 'user-123' });
    mockAuthenticationTokenManager.createAccessToken = vi.fn().mockResolvedValue('some_new_access_token');

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload);

    expect(mockAuthenticationTokenManager.verifyRefreshToken).toBeCalledWith('some_refresh_token');
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith('some_refresh_token');
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith('some_refresh_token');
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(accessToken).toEqual('some_new_access_token');
  });
});
