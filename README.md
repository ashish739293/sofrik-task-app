# 🗂️ Project Manager App

A full-stack application that helps users manage projects and tasks with a clean UI and useful features like authentication, filtering, and CRUD operations.

---

## 🚀 Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, React Icons
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MongoDB (via Prisma)
- **Auth**: JWT-based authentication stored in cookies
- **UI/UX**: Fully responsive, modals, icons, filters

---

## 📋 Features

### 👤 User Authentication
- Secure registration and login
- JWT tokens stored in cookies
- Middleware protected routes

### 📁 Project Management
- Create, update, delete projects
- Filter projects by status (`active`, `completed`)
- Search projects by title
- View project details
- Clicking a project shows all its tasks

### ✅ Task Management
- Tasks linked to individual projects
- Create, update, delete tasks
- Filter tasks by status (`todo`, `in-progress`, `done`)
- Search tasks by title
- Due date selection using datetime input

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ashish739293/sofrik-task-app.git
cd sofrik-task-app

2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure Environment Variables
Create a .env file in the root folder:

env
Copy
Edit
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/project-manager?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-key"
Replace with your actual MongoDB credentials.

4. Initialize Prisma
bash
Copy
Edit
npx prisma generate
npx prisma db push
🌱 Seeding the Database
Run this to insert 2 users, each with 2 projects and each project with 3 tasks:

bash
Copy
Edit
npx tsx prisma/seed.ts
Seeded Users:
Email	Password
test@example.com	Test@123
user2@example.com	Test@123

🧪 Run the Application
Start the development server:

bash
Copy
Edit
npm run dev
Then open your browser to:

arduino
Copy
Edit
http://localhost:3000
📌 Known Limitations
No password reset functionality

No role-based access (admin/user separation)

Tasks are not real-time synced across devices

Minimal input validation on forms

Basic error handling only

🔧 Improvements (To-do)
Toast notifications

Pagination for long lists

Real-time task updates (e.g., with socket.io)

Mobile-first design enhancements

Admin dashboard

📁 Folder Structure
bash
Copy
Edit
/app
  /api
    /auth
    /projects
    /tasks
  /components
  /project/[id]
  /dashboard
/prisma
  schema.prisma
  seed.ts
🤝 Contributing
If you find a bug or have suggestions, feel free to open an issue or fork and submit a PR.


