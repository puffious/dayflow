# 🚀 Dayflow - HR Management System

A modern, web-based Human Resource Management System that enables organizations to efficiently manage employee data, attendance, leave requests, and basic HR workflows.

## 📋 Features

- **Employee Management**: CRUD operations for employee profiles
- **Attendance Tracking**: Clock in/out system with daily reports
- **Leave Management**: Request, approve, and track employee leaves
- **Dashboard**: Real-time analytics and insights
- **Authentication**: Secure user login with Supabase Auth
- **Modern UI**: Clean, responsive interface built with React and shadcn/ui

## 🏗️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack Query

### Deployment
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for frontend)
- **Self-Hostable**: ✅ Yes

## 📂 Project Structure

```
onew/
├── backend/                  # Backend API
│   ├── config/
│   │   └── supabaseClient.js
│   ├── routes/
│   │   ├── employeeRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── leaveRoutes.js
│   ├── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env
├── frontend/          # Frontend Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── hooks/
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.ts
├── docs/                    # Documentation
├── docker-compose.yml       # Docker orchestration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- **Docker** and **Docker Compose** installed
- **Supabase Account** (free tier works)
- **Git** installed

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd onew
```

### 2. Configure Environment Variables

#### Backend Configuration

The `.env` file is already configured in `backend/.env`:

```env
PORT=5000
SUPABASE_URL=https://wcpvwigyqkzpzlxjjmvt.supabase.co/
SUPABASE_SERVICE_KEY=<your-service-key>
FRONTEND_URL=http://localhost
```

**Note**: The Supabase credentials are already set up. If you need to change them, update the `.env` file.

#### Frontend Configuration (Optional)

For local development, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

For production, the `.env.production` file is already configured to use `http://backend:5000`.

### 3. Deploy with Docker Compose

#### Build and Start All Services

```bash
docker-compose up -d --build
```

This command will:
- Build the backend Docker image
- Build the frontend Docker image
- Start both services
- Set up networking between containers

#### Check Service Status

```bash
docker-compose ps
```

You should see:
- `backend` running on port 5000
- `frontend` running on port 80

#### View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### 4. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

### 5. Stop the Application

```bash
# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🛠️ Development Mode

### Backend Development

```bash
cd backend
npm install
npm run dev
```

The backend will run on http://localhost:5000 with hot reload.

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:8080 with hot reload.

**Note**: In development mode, make sure to update `frontend/.env` to point to `http://localhost:5000`.

## 📡 API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees/register` - Create new employee with auth

### Attendance
- `POST /api/attendance/check-in` - Clock in
- `PUT /api/attendance/check-out/:attendanceId` - Clock out
- `GET /api/attendance/:employee_id` - Get attendance history

### Leaves
- `POST /api/leaves/request` - Request leave
- `GET /api/leaves/pending` - Get pending leaves (admin)
- `PUT /api/leaves/status/:id` - Approve/reject leave

## 🔒 Supabase Setup

The project uses Supabase for:
1. **Authentication** - User signup/login
2. **Database** - PostgreSQL database for storing data

### Required Supabase Tables

Make sure you have these tables in your Supabase project:

#### `employees`
```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  position TEXT,
  department TEXT,
  salary NUMERIC,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `attendance`
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id),
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status TEXT DEFAULT 'Present',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `leaves`
```sql
CREATE TABLE leaves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id),
  leave_type TEXT,
  start_date DATE,
  end_date DATE,
  reason TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🐳 Docker Commands Reference

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Rebuild and start
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Execute command in container
docker-compose exec backend sh
docker-compose exec frontend sh

# Remove all containers and volumes
docker-compose down -v --remove-orphans
```

## 🌐 Production Deployment

### Environment Variables for Production

1. Update `backend/.env` with production Supabase credentials
2. Set `FRONTEND_URL` to your production domain
3. Update `frontend/.env.production` with production API URL

### Using a Reverse Proxy (Recommended)

For production, use a reverse proxy like Nginx or Traefik:

```nginx
# Example Nginx configuration
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### SSL/TLS Configuration

For HTTPS, use Let's Encrypt with Certbot or configure your cloud provider's SSL certificate.

## 🔧 Troubleshooting

### Backend container won't start
- Check if port 5000 is already in use: `lsof -i :5000`
- Verify `.env` file exists in `backend/` directory
- Check logs: `docker-compose logs backend`

### Frontend container won't start
- Check if port 80 is already in use (may need sudo): `sudo lsof -i :80`
- Try using a different port in `docker-compose.yml`
- Check logs: `docker-compose logs frontend`

### API requests failing
- Verify backend is running: `curl http://localhost:5000/api/health`
- Check CORS configuration in `backend/index.js`
- Verify Supabase credentials in `.env`

### Database connection issues
- Verify Supabase URL and service key
- Check if Supabase project is active
- Verify tables exist in Supabase

## 📝 License

This project is built for educational and hackathon purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 👥 Authors

Built with ❤️ for the hackathon

---

**Happy Coding! 🎉**
