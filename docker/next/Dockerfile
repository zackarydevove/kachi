# Simple Next.js Frontend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY apps/frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/frontend/ .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]