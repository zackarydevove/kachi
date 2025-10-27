# Base image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY apps/backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/backend/ .

# # Generate Prisma client
# RUN npx prisma generate

# Expose port
EXPOSE 8080

# Start the application
CMD ["sh", "-c", "npm run prisma:deploy && npm run dev"]