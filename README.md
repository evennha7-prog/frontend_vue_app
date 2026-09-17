# Notes Application — Full Stack Developer Coding Assignment

> A modern, secure, full-stack Notes Management Application built with **Vue 3**, **TypeScript**, **Tailwind CSS**, **ASP.NET Core Web API**, **Dapper ORM**, and **Microsoft SQL Server**.

---

## Requirements Fulfillment Checklist

| Category | Requirement | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **Feature** | **1. Create Note** | Completed | Title (mandatory, max 255 chars), Content (optional), auto `CreatedAt` & `UpdatedAt` timestamps (UTC). |
| **Feature** | **2. Read Notes** | Completed | List display showing title & creation date. Click to view full details via modal or dedicated page. |
| **Feature** | **3. Update Note** | Completed | Edit title and content. `UpdatedAt` timestamp updates automatically on every edit. |
| **Feature** | **4. Delete Note** | Completed | Instant removal from the list with a safe confirmation dialog. |
| **Frontend** | **Authentication** | Completed | Sign in & Sign up forms with JWT session management, route guards, and error handling. |
| **Frontend** | **CRUD UI** | Completed | Complete CRUD operations directly on the dashboard + dedicated views. |
| **Frontend** | **Search & Filter** | Completed | Live keyword search (title/content), filter chips, and multi-option sorting (Newest, Oldest, Title A-Z, Updated). |
| **Frontend** | **Tailwind CSS** | Completed | 100% responsive, sleek UI (mobile, tablet, desktop) with modern color palette and transitions. |
| **Frontend** | **State Management** | Completed | **Pinia** stores (`notes.store.ts`, `auth.store.ts`) for clean, reactive state handling. |
| **Frontend** | **API Integration** | Completed | **Axios** with request interceptor (auto Bearer token) and response interceptor (401 handling). |
| **Backend** | **CRUD API** | Completed | RESTful endpoints: `GET`, `POST`, `PUT`, `DELETE` under `/api/notes`. |
| **Backend** | **User Data Isolation** | Completed | Strict multi-tenancy: users can **only** read, update, and delete their own notes (`WHERE UserId = @UserId`). |
| **Backend** | **Dapper ORM** | Completed | High-performance queries with parameterized SQL to prevent SQL injection. |
| **Backend** | **Database** | Completed | Microsoft SQL Server with automated schema creation and initial demo seed data. |

---

## Technology Stack

### Frontend
- **Framework:** [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router](https://router.vuejs.org/) with navigation authentication guards
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)

### Backend
- **Framework:** [ASP.NET Core Web API](https://learn.microsoft.com/en-us/aspnet/core/) (.NET 10)
- **Language:** C#
- **ORM / Micro-ORM:** [Dapper](https://github.com/DapperLib/Dapper)
- **Database:** Microsoft SQL Server (LocalDB / SQLEXPRESS / Remote SQL Server)
- **Security:** JWT (JSON Web Tokens) Bearer Authentication & BCrypt password hashing
- **API Documentation:** OpenAPI / Scalar API Reference

---

## Quick Start Guide

### Prerequisites
1. **.NET SDK** (.NET 10 or .NET 8+)
2. **Node.js** (v18+ or v20+) and **npm**
3. **Microsoft SQL Server** (SQL Server Express or LocalDB)

---

### Step 1: Backend Setup (`backend_api`)

1. Open terminal and navigate to the backend folder:
   ```bash
   cd backend_api
   ```

2. **Configure SQL Server Connection String:**
   Open `appsettings.json` and verify the `ConnectionStrings:DefaultConnection`. By default, it connects to local SQL Server Express:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=.\\SQLEXPRESS;Database=Backend_DB;Integrated Security=True;TrustServerCertificate=True;MultipleActiveResultSets=True;"
   }
   ```
   *(Note: You can change `Server=.\\SQLEXPRESS` to `Server=(localdb)\\mssqllocaldb` or your custom SQL Server instance name).*

3. **Run the Backend API:**
   ```bash
   dotnet run
   ```
   > **Note on Automatic Database Migration & Seeding:**
   > On startup, the API automatically verifies/creates the `Backend_DB` database, generates `Users` and `Notes` tables, and seeds a ready-to-test demo account if the database is fresh.

4. **Backend URLs:**
   - HTTP: `http://localhost:5291`
   - Interactive API Docs (Scalar): `http://localhost:5291/scalar/v1`

---

### Step 2: Frontend Setup (`front_vue`)

1. In a new terminal window, navigate to the frontend folder:
   ```bash
   cd front_vue
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```
   *(Requests to `/api/*` are automatically proxied by Vite to the backend running at `http://localhost:5291`).*

---

## Demo Login Credentials

You can immediately log in using the pre-seeded demo user or register a new account:

| Field | Demo Credentials |
| :--- | :--- |
| **Username** | `testadmin` |
| **Email** | `admin@test.com` |
| **Password** | `AdminPass123!` |

*(Or click **"Create Account"** on the login screen to register your own custom user).*

---

## Project Architecture

```
Fullstack webtest/
├── backend_api/                     # ASP.NET Core Web API (.NET 10)
│   ├── Controllers/                 # REST API Controllers
│   │   ├── AuthController.cs        # Register, Login, Get Current User
│   │   └── NotesController.cs       # Notes CRUD (Protected by JWT)
│   ├── Data/                        # Database connection & Auto-migration
│   │   ├── DatabaseConnection.cs    # Table creation & initial seeding logic
│   │   └── SqlConnectionFactory.cs  # IDbConnection provider for Dapper
│   ├── DTOs/                        # Data Transfer Objects
│   │   ├── Auth/                    # LoginRequest, RegisterRequest, etc.
│   │   └── Notes/                   # CreateNoteRequest, UpdateNoteRequest, NoteResponse
│   ├── Middleware/                  # ExceptionMiddleware & JwtMiddleware
│   ├── Models/                      # Note.cs, User.cs entities
│   ├── Repositories/                # Data access layer using Dapper
│   │   ├── NoteRepository.cs        # Parameterized SQL for Notes
│   │   └── UserRepository.cs        # Parameterized SQL for Users
│   ├── Services/                    # Business logic layer (AuthService, NoteService)
│   ├── appsettings.json             # DB connection strings & JWT configuration
│   └── Program.cs                   # App configuration & middleware pipeline
│
└── front_vue/                       # Vue 3 Frontend (Vite + TypeScript)
    ├── src/
    │   ├── assets/                  # CSS styles & design tokens
    │   ├── components/              # Modular UI components
    │   │   ├── common/              # BaseButton, BaseInput, BaseModal, BaseToast, etc.
    │   │   └── notes/               # NoteCard, NoteList, NoteFilter, NoteSearch, NoteForm
    │   ├── layouts/                 # AuthLayout.vue, DefaultLayout.vue
    │   ├── router/                  # Vue Router with navigation auth guards
    │   ├── services/                # Axios API services (api.ts, auth.service.ts, notes.service.ts)
    │   ├── stores/                  # Pinia state stores (auth.store.ts, notes.store.ts)
    │   ├── types/                   # TypeScript interfaces (Note, User, etc.)
    │   ├── utils/                   # Date formatters, markdown renderer
    │   └── views/                   # Main page views
    │       ├── LoginView.vue        # Sign In page
    │       ├── RegisterView.vue     # Sign Up page
    │       ├── NotesView.vue        # Notes dashboard (All CRUD operations)
    │       ├── NoteDetailView.vue   # Full note detail view
    │       ├── CreateNoteView.vue   # Dedicated compose view
    │       └── EditNoteView.vue     # Dedicated edit view
    ├── tailwind.config.js           # Tailwind design tokens
    └── vite.config.ts               # Vite configuration & backend proxy
```

---

## Security & Architecture Highlights

1. **User Isolation (Multi-Tenancy):**
   - The user ID is cryptographically extracted from the JWT token on the server side (`GetCurrentUserId()`).
   - Every note query strictly applies `WHERE UserId = @UserId`, making it technically impossible for any user to read, update, or delete another user's notes.
2. **Parameterized SQL (Anti-SQL Injection):**
   - All database operations utilize Dapper parameterized statements (`@UserId`, `@Title`, `@Content`, `@Search`), ensuring high performance and absolute protection against SQL Injection attacks.
3. **UTC Timestamps:**
   - `CreatedAt` and `UpdatedAt` are managed consistently in UTC (`DateTime.UtcNow`) across database columns (`DATETIME2`) and formatted on the client according to local time.
4. **Token-Based Auth & Interceptors:**
   - Frontend includes Axios interceptors that seamlessly attach `Authorization: Bearer <token>` to all protected outgoing requests and automatically redirect on session expiry (HTTP 401).

---

## API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user account
- `POST /api/auth/login` — Login and retrieve JWT Bearer token
- `GET /api/auth/me` — Get profile of currently authenticated user

### Notes (`/api/notes`) *(All require JWT)*
- `GET /api/notes` — Get all notes for the authenticated user (supports `?search=` and `?sort=`)
- `GET /api/notes/{id}` — Get single note by ID
- `POST /api/notes` — Create note (`{ title: string, content?: string }`)
- `PUT /api/notes/{id}` — Update note (`{ title: string, content?: string }`)
- `DELETE /api/notes/{id}` — Delete note by ID
