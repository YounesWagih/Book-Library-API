# 📚 Book Library API

A secure and scalable RESTful API for managing a book borrowing system. Built with **NestJS**, **Prisma**, and **PostgreSQL**, the API supports user authentication, role-based access (Admin/User), book management, and real-time borrowing status.

---

## 🚀 Features

### ✅ Authentication & Authorization
- Secure registration & login (JWT-based)
- Role-based access control: `ADMIN` and `USER`
- Guards for protected routes

### 📘 Book Management
- Public listing of books
- Admin-only create, update, delete
- Controlled `available` status based on borrowing

### 📦 Borrowing System
- Users can borrow and return books
- Prevents duplicate borrowals
- Tracks due dates (default 14 days)
- Borrow history per user

---

## 🧱 Tech Stack

| Layer       | Tech                             |
|-------------|----------------------------------|
| Framework   | [NestJS](https://nestjs.com/)    |
| ORM         | [Prisma](https://www.prisma.io/) |
| Database    | PostgreSQL                       |
| Auth        | JWT + Passport                   |
| Validation  | class-validator                  |
| Hashing     | bcrypt                           |

---

## 📁 Project Structure

```bash
src/
├── auth/             # Auth logic: login, register, guards, strategies
├── user/             # User service & controller
├── book/             # Book CRUD logic (admin protected)
├── borrow/           # Borrow/return system logic
├── database/         # Prisma service (renamed from prisma)
├── main.ts           # App entry + global validation pipe
└── app.module.ts     # Module imports
````

---

## ⚙️ Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/YounesWagih/Book-Library-API.git
cd book-library-api

# Install dependencies
npm install
```

---

### 2. Set up Environment

Create `.env` file (you can copy from `.env.example`):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/book_library
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1d
```

---

### 3. Run Prisma & Seed Admin

```bash
# Apply schema to DB
npx prisma migrate dev --name init

# Optional: seed admin user
npm run seed
```

Default seeded admin:

```txt
email: admin@lib.com
password: admin123
```

---

### 4. Start the App

```bash
# Start in dev mode
npm run start:dev

# Or build for production
npm run build
npm run start:prod
```

---

## 📮 API Endpoints

### 🔐 Auth (`/auth`)

| Method | Route       | Description       |
| ------ | ----------- | ----------------- |
| POST   | `/register` | Register new user |
| POST   | `/login`    | Login, get JWT    |

---

### 📚 Books (`/books`)

| Method | Route        | Access     | Description         |
| ------ | ------------ | ---------- | ------------------- |
| GET    | `/books`     | Public     | List all books      |
| GET    | `/books/:id` | Public     | Get book by ID      |
| POST   | `/books`     | Admin only | Create new book     |
| PUT    | `/books/:id` | Admin only | Update book details |
| DELETE | `/books/:id` | Admin only | Delete a book       |

---

### 📦 Borrowing

| Method | Route             | Access | Description                |
| ------ | ----------------- | ------ | -------------------------- |
| POST   | `/borrow/:bookId` | User   | Borrow a book if available |
| PATCH  | `/return/:bookId` | User   | Return a borrowed book     |
| GET    | `/my-borrows`     | User   | View user borrow history   |

---

## 🧪 Example Request (via cURL)

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "admin@lib.com", "password": "admin123" }'
```

Copy the returned token and include it in your requests:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 📌 Best Practices Implemented

* ✅ Role-based route access (`@Roles`, `RolesGuard`)
* ✅ `JwtAuthGuard` for secure endpoints
* ✅ DTO validation using `class-validator`
* ✅ Layered architecture (module/service/controller)
* ✅ Derived fields like `available` managed internally
* ✅ Prisma as single source of truth for DB

---

## 🌱 Future Improvements (Ideas)

* Email reminders for due books
* Pagination and filtering for books
* Admin dashboard stats (most borrowed books)
* Overdue penalty tracking
* Unit & e2e tests (Jest + Supertest)
* Docker + CI/CD + Railway deployment

