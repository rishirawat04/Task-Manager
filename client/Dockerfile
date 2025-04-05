# # Build stage
# FROM node:18-alpine AS build

# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy rest of the application
# COPY . .

# # Build the application
# RUN npm run build

# # Production stage
# FROM nginx:alpine

# # Copy built assets from build stage
# # For Create React App, the build output is in 'build' directory
# # For Vite, the build output is in 'dist' directory
# COPY --from=build /app/dist /usr/share/nginx/html

# # Add nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]


FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

EXPOSE 5173

# For development
CMD ["npm", "run", "dev", "--", "--host"]