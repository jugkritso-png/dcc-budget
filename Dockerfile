FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Frontend
RUN npm run build

# Expose the API port
EXPOSE 3002

# Start the server
CMD ["npm", "run", "server"]
