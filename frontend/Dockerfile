# frontend/Dockerfile

# Use the official Node.js image.
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy the dependency definitions.
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies.
RUN npm install -g pnpm && pnpm install

# Copy the application files.
COPY . .

# Build the app
RUN pnpm build

# Serve the app
CMD ["pnpm", "start"]
