# Survey App

A full-stack web application for creating and taking surveys. Built with a modern tech stack featuring a React frontend and a .NET backend API with MongoDB.

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Fast build tool and dev server
- **Bootstrap 5** - CSS framework for responsive design
- **Axios** - HTTP client for API calls

### Backend
- **.NET 10** - Web framework
- **ASP.NET Core** - REST API
- **MongoDB** - NoSQL database
- **JWT** - Authentication and authorization
- **Mongo2Go** - MongoDB testing utilities

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Project Structure

```
survey/
├── survey-app/                 # Backend (.NET)
│   ├── Controllers/            # API endpoints
│   ├── Models/                 # Data models and DTOs
│   ├── Services/               # Business logic
│   ├── Program.cs              # Application configuration
│   └── SurveyAPI.csproj        # Project file
├── survey-frontend/            # Frontend (React)
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API service calls
│   │   └── styles/             # Styling
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Dependencies
├── docker-compose.yml          # Multi-container setup
└── README.md                   # This file
```

## Features

- **User Authentication**: Sign up and login with JWT-based authentication
- **Survey Management**: Create, read, and manage surveys
- **Survey Responses**: Take surveys and submit responses
- **User Profiles**: User management and survey history tracking
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Docker and Docker Compose (for containerized setup)
- OR
- .NET 10 SDK (for local backend development)
- Node.js 18+ (for local frontend development)
- MongoDB (for local database)

## Getting Started

### Option 1: Run with Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd survey
   ```

2. Start all services:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

4. Stop all services:
   ```bash
   docker-compose down
   ```

### Option 2: Run Locally

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd survey-app/SurveyAPI
   ```

2. Install dependencies and build:
   ```bash
   dotnet restore
   dotnet build
   ```

3. Set up environment variables (.env file):
   ```
   ASPNETCORE_URLS=http://+:5000
   MONGODB_CONNECTION_STRING=mongodb://localhost:27017
   MONGODB_DATABASE_NAME=SurveyDB
   MONGODB_SURVEYS_COLLECTION=Surveys
   MONGODB_USERS_COLLECTION=Users
   SECRET=your-secret-key-at-least-16-bytes
   ```

4. Run the backend:
   ```bash
   dotnet run
   ```

The API will be available at http://localhost:5000

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd survey-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:5173

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `dotnet build` - Build the project
- `dotnet run` - Run the application
- `dotnet test` - Run tests (if configured)

## API Endpoints

The backend provides the following main endpoints:

- **Authentication**
  - `POST /api/login` - User login
  - `POST /api/user/register` - User registration

- **Surveys**
  - `GET /api/survey` - Get all surveys
  - `POST /api/survey` - Create a new survey
  - `GET /api/survey/{id}` - Get survey by ID
  - `PUT /api/survey/{id}` - Update survey
  - `DELETE /api/survey/{id}` - Delete survey

- **Users**
  - `GET /api/user/profile` - Get user profile
  - `PUT /api/user/profile` - Update user profile

For more details, refer to `survey-app/SurveyAPI/SurveyAPI.http`

## Database

MongoDB is used for data persistence. The database includes collections for:
- **Users** - User accounts and authentication data
- **Surveys** - Survey questions and metadata

## Configuration

Configuration is managed through environment variables and `appsettings.json` files:

- **Backend**: `survey-app/SurveyAPI/appsettings.json`
- **Frontend**: Environment variables are typically managed via `.env` file

## Development

### Making Changes

1. **Backend Changes**: Modify files in `survey-app/SurveyAPI/`, then rebuild
2. **Frontend Changes**: Modify files in `survey-frontend/src/`, automatic hot-reload in dev mode

### Building for Production

**Frontend**:
```bash
cd survey-frontend
npm run build
```

**Backend**:
```bash
cd survey-app
docker build -t survey-api .
```

## Docker

The application includes Dockerfiles for both frontend and backend:

- `survey-app/Dockerfile` - Multi-stage build for .NET application
- `survey-frontend/Dockerfile` - Build and serve React application with nginx

## Environment Variables

### Backend
- `ASPNETCORE_URLS` - Server URL and port
- `MONGODB_CONNECTION_STRING` - MongoDB connection string
- `MONGODB_DATABASE_NAME` - Database name
- `MONGODB_SURVEYS_COLLECTION` - Surveys collection name
- `MONGODB_USERS_COLLECTION` - Users collection name
- `SECRET` - JWT secret key (minimum 16 bytes)

## License

This project is available under the MIT License. See LICENSE file for details.
