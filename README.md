# Zenflow - PMS (Project Management System)

A comprehensive database-driven project management system with role-based access control, built with React, Node.js, and MySQL.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   touch .env
   ```
   
   Add your database configuration:
   ```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=zenflow3
   ```

4. **Set up database:**
   - Create MySQL database named `zenflow3`
   - Import the schema from `schema.sql`
   - Run `node seed.js` to populate initial data

5. **Start backend server:**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 📱 Features

- **Admin Dashboard**: Employee management, departments, payroll, analytics
- **Employee Portal**: Attendance tracking, salary history, profile management
- **Responsive Design**: Mobile-optimized interface
- **Role-based Access**: Secure authentication system

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT-based

## 📁 Project Structure

```
├── backend/
│   ├── controllers/     # API controllers
│   ├── routes/         # API routes
│   ├── middlewares/    # Authentication middleware
│   ├── schema.sql      # Database schema
│   └── seed.js         # Initial data
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── service/    # API services
│   │   └── styling/    # CSS files
│   └── public/         # Static assets
```

## 🔐 Default Credentials

- **Admin**: Check `seed.js` for admin credentials
- **Employee**: Use any employee ID from the seeded data

## 📝 Environment Variables

Create `.env` files in both frontend and backend directories as needed for API endpoints and database connections.
