# CRM Server

A comprehensive Customer Relationship Management (CRM) backend system built with Node.js, Express, TypeScript, and MongoDB. This server provides a robust API for managing leads, clients, loan applications, repayments, and user management with real-time notifications.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with 2FA support
- **Lead & Client Management**: Complete CRUD operations for managing leads and clients
- **Loan Management**:
  - Loan applications processing
  - Loan tracking and management
  - Repayment scheduling and tracking
- **User Management**: Multi-role user system with permissions
- **Real-time Notifications**: Socket.io integration for instant updates
- **Dashboard Analytics**: Comprehensive statistics and reporting
- **Location Profiles**: Manage location-based profiles
- **Hub Management**: Organization hub management system
- **Email Notifications**: Automated email system using Nodemailer
- **Image Upload & Processing**: Support for image uploads with HEIC conversion
- **OTP Verification**: Secure OTP-based verification system
- **Logging System**: Winston-based comprehensive logging with daily rotation
- **Rate Limiting**: API rate limiting for security
- **Static Content Management**: Manage static content and configurations

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Cache**: Redis (IORedis)
- **Real-time**: Socket.io
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Password Hashing**: Bcrypt
- **Email**: Nodemailer
- **Image Processing**: Sharp, HEIC Convert
- **Logging**: Winston with daily rotate file
- **Task Scheduling**: Node-cron
- **Containerization**: Docker & Docker Compose
- **Payment Processing**: Stripe
- **Message Queue**: KafkaJS

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Redis
- npm or yarn
- Docker & Docker Compose (for containerized deployment)

## 🔧 Installation

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd crm_server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Configuration section)

5. **Build the project**
   ```bash
   npm run build
   ```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=5010
SOCKET_PORT=5011
IP=localhost
BASE_URL=http://localhost:5010
PROJECT_NAME=CRM Server

# Database
DATABASE_URL=mongodb://localhost:27017/crm_db

# Security
SALT_ROUND=10

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

# JWT Tokens
ACCESS_KEY=your_access_secret_key
ACCESS_EXPIRE_IN=1d
SIGNUP_KEY=your_signup_secret_key
SIGNUP_EXPIRE_IN=1h
FORGOT_PASSWORD_KEY=your_forgot_password_key
FORGOT_PASSWORD_EXPIRE_IN=15m
REFRESH_KEY=your_refresh_secret_key
REFRESH_EXPIRE_IN=7d
RESET_PASSWORD_KEY=your_reset_password_key
RESET_PASSWORD_EXPIRE_IN=15m

# Two-Factor Authentication
TWO_FA_KEY=your_two_fa_secret_key
TWO_FA_EXPIRE_IN=5m

# OTP
OTP_EXPIRE_IN=300000

# Email Configuration
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password

# Logger Access
LOGGER_USERNAME=logger_username
LOGGER_PASSWORD=logger_password

# Monitoring
MONITOR_USERNAMES=monitor_user
MONITOR_PASSWORDS=monitor_password
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Server will start on `http://localhost:5010` and Socket server on `ws://localhost:5011`

### Production Mode

```bash
npm run build
npm run start:prod
```

### Docker Mode

```bash
docker-compose up -d
```

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (requires build)
- `npm run start:prod` - Start production server directly
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run prettier` - Format code with Prettier
- `npm run prettier:fix` - Fix code formatting

## 📁 Project Structure

```
crm_server/
├── src/
│   ├── app/
│   │   ├── constant/          # Application constants
│   │   ├── DB/               # Database seeders
│   │   ├── helper/           # Helper functions
│   │   ├── interface/        # TypeScript interfaces
│   │   ├── middleware/       # Express middlewares
│   │   ├── modules/          # Feature modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── dashboard/    # Dashboard & analytics
│   │   │   ├── hubManager/   # Hub management
│   │   │   ├── leadsAndClients/ # Lead & client management
│   │   │   ├── loanApplication/ # Loan applications
│   │   │   ├── loans/        # Loan management
│   │   │   ├── locationProfile/ # Location profiles
│   │   │   ├── notification/ # Notifications
│   │   │   ├── otp/          # OTP verification
│   │   │   ├── repayments/   # Repayment management
│   │   │   ├── staticContent/ # Static content
│   │   │   ├── twoFA/        # Two-factor authentication
│   │   │   └── user/         # User management
│   │   ├── QueryBuilder/     # Query building utilities
│   │   ├── router/           # Route configuration
│   │   └── utils/            # Utility functions
│   ├── config/               # Configuration files
│   ├── Errors/               # Error handling
│   ├── shared/               # Shared resources
│   │   ├── html/             # Email templates
│   │   ├── style/            # Styling utilities
│   │   └── validation/       # Validation schemas
│   ├── socket/               # Socket.io configuration
│   ├── app.ts                # Express app setup
│   ├── redis.ts              # Redis configuration
│   └── server.ts             # Server entry point
├── logs/                     # Application logs
├── public/                   # Static files
│   └── uploads/              # Uploaded files
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Docker configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🔌 API Endpoints

The API is organized into the following modules:

- `/api/v1/auth` - Authentication endpoints
- `/api/v1/users` - User management
- `/api/v1/leads` - Lead and client management
- `/api/v1/loans` - Loan management
- `/api/v1/loan-applications` - Loan application processing
- `/api/v1/repayments` - Repayment tracking
- `/api/v1/notifications` - Notification management
- `/api/v1/dashboard` - Dashboard statistics
- `/api/v1/hub-manager` - Hub management
- `/api/v1/location-profile` - Location profiles
- `/api/v1/static-content` - Static content management
- `/api/v1/logs` - Application logs access

## 🔒 Security Features

- JWT-based authentication
- Two-factor authentication (2FA)
- Bcrypt password hashing
- Rate limiting
- CORS configuration
- Cookie parser for secure cookie handling
- Environment-based configuration
- Input validation with Zod
- Authentication middleware

## 📊 Logging

The application uses Winston for comprehensive logging:

- Error logs: `logs/winston/errors/`
- Success logs: `logs/winston/successes/`
- Daily log rotation
- Colored console output in development

## 🐳 Docker Support

The project includes Docker configuration for easy deployment:

- **Server Port**: 5010
- **Socket Port**: 5011
- **Redis Port**: 6379

Services:

- `app`: Main application container
- `redis`: Redis cache container

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

The project uses:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

Run linting and formatting:

```bash
npm run lint:fix
npm run prettier:fix
```

## 📄 License

ISC

## 👥 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Note**: Make sure to configure all environment variables before running the application. Never commit sensitive information like API keys or passwords to the repository.
