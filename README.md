# Job Portal Web Application

A full-stack job portal web application built with Spring Boot, React, TailwindCSS, and MySQL.

## Features
- **Job Seeker**: Browse jobs, view details, apply with a resume, track applications.
- **Employer**: Post new jobs, view posted jobs, and review applicants and their resumes.
- **Admin**: View all registered users and all jobs.
- **Authentication**: JWT-based secure login and registration with Spring Security.
- **UI/UX**: Responsive and beautiful design utilizing Tailwind CSS and Lucide React icons.

## Prerequisites
- Java 17
- Node.js & npm (v18+)
- MySQL (v8+)

## Database Setup
Ensure MySQL is running on `localhost:3306` with username `root` and password `root`.
1. Log into MySQL: `mysql -u root -p`
2. Create the database: `CREATE DATABASE IF NOT EXISTS jobportal;`

(If your MySQL credentials differ, update them in `backend/src/main/resources/application.properties` before starting the backend.)

## Running the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
3. The server will start on `http://localhost:8080` and automatically create the necessary database tables.

## Running the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## Usage Guide
- You can register a new account as an **Employer** or a **Job Seeker** via the Sign Up page.
- **Employers** can navigate to the Dashboard to create new job listings.
- **Job Seekers** can browse jobs, view details, and upload their resume to apply.
- To create an **Admin** user, you can register as a job seeker, then manually update the role to `ROLE_ADMIN` in the `users` database table.
