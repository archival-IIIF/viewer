FROM node:lts-alpine AS builder

# Install tooling
RUN apk --no-cache add git

# Copy the application
RUN mkdir -p /app
COPY . /app
WORKDIR /app

# Install the application dependencies and build the application
RUN npm install
RUN npm run build

# Create the actual image
FROM nginx:stable-alpine

# Copy the build
COPY --from=builder /app/build /usr/share/nginx/html

# Expose the web server port
EXPOSE 80

# Run web server
CMD ["nginx", "-g", "daemon off;"]
