# 🗣️ Forum API

A RESTful API for a forum application built with Express.js and PostgreSQL.
Developed as a submission project for Dicoding's Back-End Expert class.

---

## 👤 Author

- **Name** : Arisca Pramalistyo
- **GitHub** : [@AriscaPramalistyo05](https://github.com/AriscaPramalistyo05)

---

## 🔗 Links

- **Repository** : https://github.com/AriscaPramalistyo05/forum-api
- **Live URL (HTTPS)** : https://rude-seals-wish-lazily.st.a.dcdg.xyz

---

## 📋 Submission Criteria

### ✅ Continuous Integration (CI)
- Automated testing using GitHub Actions
- Triggered on pull request to master branch
- Includes Unit Test, Integration Test, and Functional Test
- Minimum 2 CI runs (1 failed, 1 success)

### ✅ Continuous Deployment (CD)
- Automated deployment using GitHub Actions
- Triggered on push to master branch
- Deployed to Alibaba Cloud ECS (Ubuntu 22.04)

### ✅ Limit Access (Rate Limiting)
- NGINX rate limiting applied to /threads and its sub-paths
- Maximum 90 requests per minute
- NGINX configuration file included in root project

### ✅ HTTPS
- API accessible via HTTPS protocol
- SSL certificate issued by Let's Encrypt
- Domain: rude-seals-wish-lazily.st.a.dcdg.xyz

---

## 🛠️ Tech Stack

- **Runtime** : Node.js 18
- **Framework** : Express.js
- **Database** : PostgreSQL
- **Testing** : Vitest
- **Process Manager** : PM2
- **Web Server** : NGINX
- **CI/CD** : GitHub Actions
- **Cloud** : Alibaba Cloud ECS

---

## 🚀 API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /users | Register new user |

### Authentications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /authentications | Login |
| PUT | /authentications | Refresh token |
| DELETE | /authentications | Logout |

### Threads
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /threads | Create thread |
| GET | /threads/:threadId | Get thread detail |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /threads/:threadId/comments | Add comment |
| DELETE | /threads/:threadId/comments/:commentId | Delete comment |
