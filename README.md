# matcha 💘

Because, love too can be industrialized

## Project Overview 🚀

**Matcha** is a full-stack web application designed to facilitate social connections, featuring real-time chat, user profiles, event management, notifications, and more. The project is architected with a clear separation of concerns between the frontend, backend, and infrastructure layers, ensuring maintainability and scalability.

### Backend 🛠️

- **Stack:** Node.js, Express, PostgreSQL, Socket.IO, Zod, and more.
- **Features:**  
  - 🧑‍💻 RESTful API for user management, authentication, chat, events, notifications, and media uploads.
  - ⚡ Real-time communication via WebSockets for chat and notifications.
  - 🗂️ Modular structure with Controllers, Models, Middlewares, Schemas, and Utilities.
  - 🔒 Data validation and security best practices (e.g., password hashing, input validation).
  - 🧪 Fixture loading for development and testing.
- **Directory:** `Backend/`

### Frontend 🎨

- **Stack:** React, TypeScript, Vite, TailwindCSS, React Router, Socket.IO client.
- **Features:**  
  - 📱 Responsive SPA with modern UI/UX.
  - 💬 Real-time chat, notifications, and profile management.
  - 🧩 Modular component structure for maintainability.
- **Directory:** `Frontend/`

### Infrastructure & Docker 🐳

- **Dockerized Architecture:**  
  - 📦 Each service (backend, frontend, PostgreSQL) is containerized for easy deployment and development.
  - 🛠️ Custom Dockerfiles for each service under `Docker/`.
  - 🧩 Centralized orchestration using `docker-compose.yml`.
  - 🗄️ Database initialization scripts and persistent volumes for PostgreSQL.
  - 🔑 Environment variable management for secure configuration.

---

## Authorship 🙌

> **Backend and Docker Structure:**  
> The backend implementation and the core Docker-based infrastructure were designed and developed by **flamiing** (me).

> **Frontend and Additional Docker Contributions:**  
> The frontend application and several enhancements to the Docker infrastructure were developed by **magnitopic**.

---