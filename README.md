# Task Manager Application

A simple task management application built with a focus on architectural scalability principles.

## Overview

This application allows users to create, update, and manage tasks. It features:

- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Optional categorization of tasks (feature-flagged)
- Optional priority levels for tasks (feature-flagged)
- API versioning for backward compatibility

## Architecture

The application follows a modern, containerized architecture:

- **Frontend**: React.js application with Material-UI
- **Backend**: Spring Boot REST API with MongoDB
- **Database**: MongoDB for document storage
- **Deployment**: Docker containers orchestrated with Docker Compose
- **CI/CD**: GitHub Actions for continuous integration and deployment

## Architectural Scalability Principles

### 1. Design for Rollback

The application is designed with easy rollback capabilities:

- **Versioned Docker Images**: Each release creates uniquely tagged images
- **Versioned Deployment Configurations**: Docker Compose files are versioned
- **API Versioning**: API endpoints are versioned to maintain backward compatibility
- **Database Migration Scripts**: MongoDB schema changes include rollback capabilities
- **Rollback Script**: `rollback.sh` provides an easy way to revert to a previous version

### 2. Design to be Disabled

The application implements feature toggles that can be disabled without redeployment:

- **Feature Flags**: Using the Togglz library for Spring Boot
- **UI Adaptation**: Frontend dynamically adjusts based on enabled features
- **Admin Console**: Togglz console for monitoring and changing feature states
- **REST API for Features**: Endpoint to view and update feature states
- **Implemented Features**:
  - Task Categories: Ability to organize tasks into categories
  - Task Priorities: Ability to set priority levels on tasks

### 3. Build Fast, Release Small, Fail Fast

The application follows modern CI/CD practices:

- **Automated Testing**: Unit and integration tests for both frontend and backend
- **Small Atomic Commits**: Each commit should represent a single feature or fix
- **Continuous Integration**: Automatic testing on every commit
- **Automated Deployments**: Changes are automatically deployed through the pipeline
- **Smoke Tests**: Quick verification after deployment to detect failures early
- **Monitoring**: Health checks and metrics for early problem detection

### 4. Automation over People

The application minimizes manual intervention:

- **CI/CD Pipeline**: Fully automated build, test, and deployment process
- **Infrastructure as Code**: Deployment configurations are version-controlled
- **Containerization**: Docker ensures consistent environments
- **Environment Variables**: Configuration is externalized for flexibility
- **Automated Rollbacks**: Triggered automatically on deployment failures
- **Monitoring & Alerting**: Automatic detection of issues

### 5. Design for Multiple Axes of Scale

The application can scale along different dimensions:

- **X-axis (Horizontal Duplication)**:
  - Stateless API design allows running multiple identical instances
  - Load balancing across instances
  
- **Y-axis (Functional Decomposition)**:
  - Separation of concerns between components (frontend, API, database)
  - API organized by functionality (tasks, features)
  - Services can be split further (user service, notification service)

- **Z-axis (Data Partitioning)**:
  - MongoDB can be sharded for data partitioning
  - Data can be partitioned by user or by time (archive old tasks)

## Relation to CALMR

This implementation demonstrates the CALMR principles:

- **Continuous Integration & Continuous Delivery**: Automated pipeline for continuous delivery
- **Automation of Manual Processes**: Scripts and workflows to eliminate manual steps
- **Lean Flow**: Small, frequent releases with minimal waste
- **Measurement**: Health checks, metrics, and monitoring
- **Recovery**: Easy rollback capabilities and feature toggles for risk mitigation

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Java 17 (for local development)
- Node.js 16+ (for local development)
- Git

### Running the Application

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager
   ```

2. Start the application using Docker Compose:
   ```
   docker compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - API: http://localhost:8080
   - Togglz Console: http://localhost:8080/togglz-console

### Development

For local development:

1. Start MongoDB:
   ```
   docker compose up -d mongodb
   ```

2. Start the backend:
   ```
   cd backend
   ./mvnw spring-boot:run
   ```

3. Start the frontend:
   ```
   cd frontend
   npm install
   npm start
   ```

### Toggling Features

Use the provided script to toggle features without redeployment:

```
./toggle-feature.sh -f TASK_CATEGORIES -s false
```

### Rolling Back

Use the provided script to roll back to a previous version:

```
./rollback.sh -v v20230401123456-abc1234
```
