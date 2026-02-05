# Use Node official image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "index.js"]
