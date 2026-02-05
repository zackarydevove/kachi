# 💰 Kachi - Wealth Management Platform

Full-stack Wealth Management Platform application designed for secure personal financial management, featuring automated asset aggregation via Plaid API and high-fidelity historical data tracking. It is engineered with a focus on security (JWT, 2FA), performance (Redis caching), and scalability using a Dockerized architecture ready for AWS deployment.

## 🚀 Demo

The project is deployed and available at https://kachifrontend.vercel.app/

## 🛠️ Technology Stack

### Frontend
* **Next.js**
* **TypeScript**
* **Tailwind CSS**
* **Zustand**

### Backend
* **Node.js**
* **Prisma**
* **PostgreSQL**
* **Redis**

### DevOps & Infrastructure
* **Docker / Docker-Compose**
* **GitHub Actions CI/CD**
* **AWS** (EC2, RDS, API Gateway, S3, ElastiCache, VPC, IAM)

### Testing
* **Jest**
* **Supertest**
* **Playwright**


## 🚀 Getting Started

To set up and run this project locally, ensure you have **Docker**, and **Docker-Compose** installed.

### 1. Clone the Repository

```bash
git clone [https://github.com/zackarydevove/networth-tracker.git](https://github.com/zackarydevove/networth-tracker.git)
cd networth-tracker
```

### 2. Configure Environment Variables

* Create a .env file in the root, frontend, and backend directory and configure the necessary variables following the .env.example file.

### 3. Run with Docker-Compose

* Build the containers using the Docker-Compose, make sure your local postgres and redis are down and the ports you specified in the .env are available
```bash
npm run start
```

### 4. Have fun with the app

* The application will be accessible at http://localhost:3000


## ✨ Features

### Security & Authentication 🔐

* Implemented full secured authentication flow with HTTP-only access/refresh JWT
* Integrated optional 2FA support.
* Google OAuth login.
* Email confirmation for sign-up and a secure Reset password flow via email.

### Core Tracking & Data Management 📈

* Manual Assets Management: Can create, update or delete assets manually, supporting different data forms according to asset type.
* Plaid Integration: Connects to Plaid API to automate data aggregation from thousands of external banks, crypto, and investment accounts.
* Historical Graph to see networth progress: A daily CRON job runs to create asset snapshots, ensuring complete and accurate historical graph data.
* Multi-Account Support: Allows users to manage assets across multiple sub-accounts (unlimited for Pro users, one for Free users).

### Premium & Billing 💳

* Stripe Integration: Integrated Stripe for managing subscriptions and premium features.
* Subscription Management: Includes features for Upgrading to Pro, viewing and downloading Invoices, and direct management of the subscription (unsubscribing) powered by Stripe.

### Performance & DevOps ⚙️

* Caching Layer: Utilizes Redis to cache user and asset data for fast access, significantly improving performance (e.g., getUser and getAllAssets).
* Testing: Maintained code quality with extensive testing, including Backend unit tests (Jest & Supertest) and Frontend E2E tests (Playwright).
* Containerization: Full Dockerization of the application for consistent environment setup.
* CI/CD Pipeline: Automated quality assurance using GitHub Actions to run tests and streamline the build process.

### User Experience & Settings 🎨

* Responsive Design: Ensured all key components, including the asset table, add asset modal, and settings page, are fully responsive on mobile devices.
* User Settings: Allows users to modify their profile, profile picture, set/change passwords, activate 2FA, and initiate account deletion.
* Theming: Includes both Dark and Light themes.
