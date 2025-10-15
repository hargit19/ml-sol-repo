# Use the official Node.js image as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your server runs on
EXPOSE 8002

# Command to run the server
CMD ["npm", "run","devStart"]
