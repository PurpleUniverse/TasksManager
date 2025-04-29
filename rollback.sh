#!/bin/bash
# rollback.sh - Roll back to a previous version of the Task Manager application

set -e

# Default values
TARGET_VERSION=""
DEPLOYMENT_DIR="/opt/task-manager"  # For demonstration; change to your actual path

# Show help
function show_help {
  echo "Usage: $0 [options]"
  echo "Roll back the Task Manager application to a previous version."
  echo ""
  echo "Options:"
  echo "  -v, --version     Target version to roll back to (e.g., v20230401123456-abc1234)"
  echo "  -d, --dir         Deployment directory (default: /opt/task-manager)"
  echo "  -l, --list        List available versions"
  echo "  -h, --help        Display this help and exit"
  echo ""
  echo "Example:"
  echo "  $0 -v v20230401123456-abc1234"
  echo "  $0 --list"
}

# List available versions
function list_versions {
  echo "Available versions for rollback:"

  if [[ ! -d "$DEPLOYMENT_DIR" ]]; then
    echo "Error: Deployment directory not found: $DEPLOYMENT_DIR"
    exit 1
  fi

  # Find all docker-compose files for different versions
  versions=$(find "$DEPLOYMENT_DIR" -name "docker-compose.v*.yml" | sort -r | sed 's/.*docker-compose\.\(.*\)\.yml/\1/')

  if [[ -z "$versions" ]]; then
    echo "No versions found."
    exit 0
  fi

  # Show each version with its timestamp
  for version in $versions; do
    # Extract timestamp and commit hash from version
    timestamp=$(echo $version | grep -o 'v[0-9]\+' | sed 's/v//')
    commit=$(echo $version | grep -o '[a-f0-9]\+$')

    # Format the timestamp as a readable date if it's in the expected format
    if [[ $timestamp =~ ^[0-9]{14}$ ]]; then
      year=${timestamp:0:4}
      month=${timestamp:4:2}
      day=${timestamp:6:2}
      hour=${timestamp:8:2}
      minute=${timestamp:10:2}
      second=${timestamp:12:2}
      formatted_date="$year-$month-$day $hour:$minute:$second"
    else
      formatted_date="Unknown date"
    fi

    # Get the current version (the one that's running)
    current=""
    if [[ -L "$DEPLOYMENT_DIR/docker-compose.current.yml" ]]; then
      current_file=$(readlink -f "$DEPLOYMENT_DIR/docker-compose.current.yml")
      if [[ "$current_file" == *"$version"* ]]; then
        current=" (current)"
      fi
    fi

    echo "- $version$current"
    echo "  Deployed: $formatted_date"
    echo "  Commit: $commit"
    echo ""
  done
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -v|--version)
      TARGET_VERSION="$2"
      shift
      shift
      ;;
    -d|--dir)
      DEPLOYMENT_DIR="$2"
      shift
      shift
      ;;
    -l|--list)
      list_versions
      exit 0
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

# Validate inputs for rollback
if [[ -z "$TARGET_VERSION" ]]; then
  echo "Error: Target version is required for rollback."
  show_help
  exit 1
fi

if [[ ! -d "$DEPLOYMENT_DIR" ]]; then
  echo "Error: Deployment directory not found: $DEPLOYMENT_DIR"
  exit 1
fi

TARGET_COMPOSE_FILE="$DEPLOYMENT_DIR/docker-compose.$TARGET_VERSION.yml"

if [[ ! -f "$TARGET_COMPOSE_FILE" ]]; then
  echo "Error: Target version compose file not found: $TARGET_COMPOSE_FILE"
  echo "Use $0 --list to see available versions."
  exit 1
fi

# Get the current version
CURRENT_VERSION=""
if [[ -L "$DEPLOYMENT_DIR/docker-compose.current.yml" ]]; then
  CURRENT_FILE=$(readlink -f "$DEPLOYMENT_DIR/docker-compose.current.yml")
  CURRENT_VERSION=$(echo $CURRENT_FILE | grep -o 'v[^\.]*')
fi

echo "Current version: ${CURRENT_VERSION:-Unknown}"
echo "Rolling back to version: $TARGET_VERSION"

# Confirm with the user
read -p "Are you sure you want to proceed with the rollback? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Rollback canceled."
  exit 0
fi

# Perform the rollback
echo "Starting rollback to version $TARGET_VERSION..."

# 1. Stop the current deployment
echo "Stopping current deployment..."
if [[ -L "$DEPLOYMENT_DIR/docker-compose.current.yml" ]]; then
  docker compose -f "$DEPLOYMENT_DIR/docker-compose.current.yml" down
else
  echo "Warning: Could not find current deployment symlink."
  echo "Attempting to stop any running services..."
  docker compose -f "$TARGET_COMPOSE_FILE" down
fi

# 2. Start the target version
echo "Starting version $TARGET_VERSION..."
docker compose -f "$TARGET_COMPOSE_FILE" up -d

# 3. Update the current version symlink
echo "Updating current version symlink..."
ln -sf "docker-compose.$TARGET_VERSION.yml" "$DEPLOYMENT_DIR/docker-compose.current.yml"

# 4. Verify the rollback
echo "Verifying rollback..."
sleep 5  # Wait for services to start

# Check if containers are running
RUNNING_CONTAINERS=$(docker compose -f "$TARGET_COMPOSE_FILE" ps --services --filter "status=running" | wc -l)
if [[ "$RUNNING_CONTAINERS" -lt 3 ]]; then  # We expect 3 services: MongoDB, API, Frontend
  echo "Warning: Not all containers are running. Check status:"
  docker compose -f "$TARGET_COMPOSE_FILE" ps
else
  echo "All containers are running."
fi

# Final confirmation
echo "Rollback to version $TARGET_VERSION completed!"
echo "If you encounter any issues, you can roll back to version $CURRENT_VERSION with:"
echo "$0 -v $CURRENT_VERSION"