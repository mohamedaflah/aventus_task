# Use Node base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4001

# Start app
CMD ["node", "dist/index.js"]