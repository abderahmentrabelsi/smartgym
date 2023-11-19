# Dockerfile

# Choose the base image for Node.js
FROM node:18-alpine as build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the application code
COPY . .

ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max-old-space-size=8092

# Define build arguments
ARG VITE_API_URL
ARG VITE_CRYSTAL_SPIDER_BASE_URL

# Set environment variables
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CRYSTAL_SPIDER_BASE_URL=$VITE_CRYSTAL_SPIDER_BASE_URL

# Build the application
RUN yarn build

# Use the Nginx server to serve the application
FROM nginx:stable-alpine as production-stage

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built application to the Nginx server
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose the application port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
