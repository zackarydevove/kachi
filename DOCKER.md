# Simple Docker Setup

## Project Structure

```
docker/
├── node/           # Backend Docker files
│   ├── Dockerfile
│   └── .dockerignore
└── next/           # Frontend Docker files
    ├── Dockerfile
    └── .dockerignore
```

## Quick Start

1. **Start all services**

   ```bash
      npm run start
   ```

2. **Access the application**
   - Frontend: http://localhost:3000

## Services

- **Frontend**: Next.js app on port 3000
- **Backend**: Node.js API on port 8080
- **PostgreSQL**: Database on port 5432
- **Redis**: Database on port 6379

## Commands

```bash
# Start services
npm run start

# Stop services
npm run stop

# Access database
docker-compose exec postgres psql -U username -d password
```

## Database Connection

- **Host**: postgres (from backend container) or localhost (from host)
- **Port**: 5432
- **Database**: kachi
- **Username**: username
- **Password**: password

## Make sure

Your local services are down (postgres and redis)

brew services
brew services stop postgres
brew services stop redis
