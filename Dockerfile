FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Frontend
RUN npm run build

# Set environment to production
ENV NODE_ENV=production

# Expose the API port
EXPOSE 3002

# Start the server
CMD ["npm", "run", "server"]
