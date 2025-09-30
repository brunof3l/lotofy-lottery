# Backend service for Lotofácil
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install --omit=dev

# Bundle app source
COPY . .

# Expose backend port
EXPOSE 3001

# Start the service
CMD ["npm", "start"]
