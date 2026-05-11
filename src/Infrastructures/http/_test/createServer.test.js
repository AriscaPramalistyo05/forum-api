import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const app = await createServer({});

    // Action
    const response = await request(app).get('/unregisteredRoute');

    // Assert
    expect(response.status).toEqual(404);
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Dicoding Indonesia',
        password: 'secret',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: ['Dicoding Indonesia'],
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit');
    });

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding indonesia',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
    });

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const requestPayload = {
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'super_secret',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('username tidak tersedia');
    });
  });

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const app = await createServer(container);

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should response 400 if username not found', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const app = await createServer(container);

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('username tidak ditemukan');
    });

    it('should response 401 if password wrong', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'wrong_password',
      };
      const app = await createServer(container);

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('kredensial yang Anda masukkan salah');
    });

    it('should response 400 if login payload not contain needed property', async () => {
      const requestPayload = {
        username: 'dicoding',
      };
      const app = await createServer(container);

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('harus mengirimkan username dan password');
    });

    it('should response 400 if login payload wrong data type', async () => {
      const requestPayload = {
        username: 123,
        password: 'secret',
      };
      const app = await createServer(container);

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('username dan password harus string');
    });
  });

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      const app = await createServer(container);

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const loginResponse = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret',
      });

      const { refreshToken } = loginResponse.body.data;
      const response = await request(app).put('/authentications').send({ refreshToken });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return 400 payload not contain refresh token', async () => {
      const app = await createServer(container);

      const response = await request(app).put('/authentications').send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('harus mengirimkan token refresh');
    });

    it('should return 400 if refresh token not string', async () => {
      const app = await createServer(container);

      const response = await request(app).put('/authentications').send({ refreshToken: 123 });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token harus string');
    });

    it('should return 400 if refresh token not valid', async () => {
      const app = await createServer(container);

      const response = await request(app).put('/authentications').send({ refreshToken: 'invalid_refresh_token' });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak valid');
    });

    it('should return 400 if refresh token not registered in database', async () => {
      const app = await createServer(container);
      const refreshToken = await container.getInstance(AuthenticationTokenManager.name).createRefreshToken({ username: 'dicoding' });

      const response = await request(app).put('/authentications').send({ refreshToken });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak ditemukan di database');
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      const app = await createServer(container);
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      const response = await request(app).delete('/authentications').send({ refreshToken });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      const app = await createServer(container);
      const refreshToken = 'refresh_token';

      const response = await request(app).delete('/authentications').send({ refreshToken });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak ditemukan di database');
    });

    it('should response 400 if payload not contain refresh token', async () => {
      const app = await createServer(container);

      const response = await request(app).delete('/authentications').send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('harus mengirimkan token refresh');
    });
  });

  describe('when POST /threads', () => {
    const daftarUser = async (app) => {
      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
    };

    const loginUser = async (app) => {
      const loginRes = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret',
      });
      return loginRes.body.data.accessToken;
    };

    it('harus response 201 dan addedThread saat berhasil', async () => {
      const app = await createServer(container);
      await daftarUser(app);
      const accessToken = await loginUser(app);

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'isi thread' });

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread).toBeDefined();
      expect(response.body.data.addedThread.id).toBeDefined();
      expect(response.body.data.addedThread.title).toBe('sebuah thread');
      expect(response.body.data.addedThread.owner).toBeDefined();
    });

    it('harus response 400 saat body request tidak lengkap', async () => {
      const app = await createServer(container);
      await daftarUser(app);
      const accessToken = await loginUser(app);

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread' });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeTruthy();
    });

    it('harus response 401 saat tidak ada access token', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post('/threads')
        .send({ title: 'sebuah thread', body: 'isi thread' });

      expect(response.status).toEqual(401);
    });
  });

  describe('when POST /threads/:threadId/comments', () => {
    const daftarDanLogin = async (app) => {
      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const loginRes = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });
      return loginRes.body.data.accessToken;
    };

    it('harus response 201 dan addedComment saat berhasil', async () => {
      const app = await createServer(container);
      const accessToken = await daftarDanLogin(app);

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'isi thread' });
      const { id: threadId } = threadRes.body.data.addedThread;

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah komentar' });

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedComment).toBeDefined();
      expect(response.body.data.addedComment.id).toBeDefined();
      expect(response.body.data.addedComment.content).toBe('sebuah komentar');
      expect(response.body.data.addedComment.owner).toBeDefined();
    });

    it('harus response 404 saat thread tidak ditemukan', async () => {
      const app = await createServer(container);
      const accessToken = await daftarDanLogin(app);

      const response = await request(app)
        .post('/threads/thread-tidak-ada/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah komentar' });

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeTruthy();
    });

    it('harus response 400 saat body request tidak lengkap', async () => {
      const app = await createServer(container);
      const accessToken = await daftarDanLogin(app);

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'isi thread' });
      const { id: threadId } = threadRes.body.data.addedThread;

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeTruthy();
    });

    it('harus response 401 saat tidak ada access token', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post('/threads/thread-123/comments')
        .send({ content: 'sebuah komentar' });

      expect(response.status).toEqual(401);
    });
  });

  describe('when DELETE /threads/:threadId/comments/:commentId', () => {
    const daftarDanLogin = async (app, username = 'dicoding') => {
      await request(app).post('/users').send({ username, password: 'secret', fullname: 'Dicoding Indonesia' });
      const loginRes = await request(app).post('/authentications').send({ username, password: 'secret' });
      return loginRes.body.data.accessToken;
    };

    it('harus response 200 saat berhasil hapus komentar', async () => {
      const app = await createServer(container);
      const accessToken = await daftarDanLogin(app);

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'isi thread' });
      const { id: threadId } = threadRes.body.data.addedThread;

      const komentarRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah komentar' });
      const { id: commentId } = komentarRes.body.data.addedComment;

      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('harus response 403 saat bukan pemilik komentar', async () => {
      const app = await createServer(container);
      const accessToken = await daftarDanLogin(app);
      const accessTokenLain = await daftarDanLogin(app, 'userLain');

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'isi thread' });
      const { id: threadId } = threadRes.body.data.addedThread;

      const komentarRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah komentar' });
      const { id: commentId } = komentarRes.body.data.addedComment;

      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessTokenLain}`);

      expect(response.status).toEqual(403);
      expect(response.body.status).toEqual('fail');
    });

    it('harus response 404 saat thread tidak ditemukan', async () => {
      const app = await createServer(container);
      const accessToken = await daftarDanLogin(app);

      const response = await request(app)
        .delete('/threads/thread-tidak-ada/comments/comment-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('harus response 401 saat tidak ada access token', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123');

      expect(response.status).toEqual(401);
    });
  });

  describe('when GET /threads/:threadId', () => {
    it('harus response 200 dan detail thread beserta komentar', async () => {
      const app = await createServer(container);

      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const loginRes = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });
      const accessToken = loginRes.body.data.accessToken;

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'isi thread' });
      const { id: threadId } = threadRes.body.data.addedThread;

      await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah komentar' });

      const response = await request(app).get(`/threads/${threadId}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.thread).toBeDefined();
      expect(response.body.data.thread.id).toBe(threadId);
      expect(response.body.data.thread.title).toBe('sebuah thread');
      expect(response.body.data.thread.body).toBe('isi thread');
      expect(response.body.data.thread.username).toBe('dicoding');
      expect(response.body.data.thread.date).toBeDefined();
      expect(response.body.data.thread.comments).toHaveLength(1);
      expect(response.body.data.thread.comments[0].content).toBe('sebuah komentar');
    });

    it('harus menampilkan **komentar telah dihapus** untuk komentar yang dihapus', async () => {
      const app = await createServer(container);

      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const loginRes = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });
      const accessToken = loginRes.body.data.accessToken;

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'isi thread' });
      const { id: threadId } = threadRes.body.data.addedThread;

      const komentarRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'komentar yang akan dihapus' });
      const { id: commentId } = komentarRes.body.data.addedComment;

      await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      const response = await request(app).get(`/threads/${threadId}`);

      expect(response.status).toEqual(200);
      expect(response.body.data.thread.comments[0].content).toBe('**komentar telah dihapus**');
    });

    it('harus response 404 saat thread tidak ditemukan', async () => {
      const app = await createServer(container);

      const response = await request(app).get('/threads/thread-tidak-ada');

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('harus bisa diakses tanpa access token', async () => {
      const app = await createServer(container);

      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const loginRes = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });
      const accessToken = loginRes.body.data.accessToken;

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'isi thread' });
      const { id: threadId } = threadRes.body.data.addedThread;

      const response = await request(app).get(`/threads/${threadId}`);
      expect(response.status).toEqual(200);
    });
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    const app = await createServer({});

    // Action
    const response = await request(app).post('/users').send(requestPayload);

    // Assert
    expect(response.status).toEqual(500);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
  });
});
