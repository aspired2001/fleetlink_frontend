# --------- STAGE 1: Build React app ---------
FROM node:18 AS build

WORKDIR /app

# Install dependencies first (cached unless package files change)
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Build the React app for production
RUN npm run build


# --------- STAGE 2: Serve with Nginx ---------
FROM nginx:stable-alpine

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from the first stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom nginx config to handle routing (React SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
