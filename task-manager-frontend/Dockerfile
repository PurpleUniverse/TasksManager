# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Add package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for configuration
ARG API_URL=http://localhost:8080
ARG VERSION=development

# Set environment variables for build
ENV REACT_APP_API_URL=$API_URL
ENV REACT_APP_VERSION=$VERSION

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Labels for versioning
ARG VERSION=unknown
ARG BUILD_DATE=unknown
ARG VCS_REF=unknown

LABEL org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.title="Task Manager Frontend" \
      org.opencontainers.image.description="Task Manager Application Frontend" \
      org.opencontainers.image.vendor="Example Organization"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]