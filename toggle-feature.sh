#!/bin/bash
# toggle-feature.sh - Toggle feature flags without redeployment

set -e

# Default values
FEATURE=""
STATE=""
API_URL="http://localhost:8080"

# Show help
function show_help {
  echo "Usage: $0 [options]"
  echo "Toggle feature flags for the Task Manager application without redeployment."
  echo ""
  echo "Options:"
  echo "  -f, --feature     Feature to toggle (TASK_CATEGORIES, TASK_PRIORITIES)"
  echo "  -s, --state       New state for the feature (true, false)"
  echo "  -u, --url         API URL (default: http://localhost:8080)"
  echo "  -h, --help        Display this help and exit"
  echo ""
  echo "Example:"
  echo "  $0 -f TASK_CATEGORIES -s false"
  echo "  $0 --feature TASK_PRIORITIES --state true"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -f|--feature)
      FEATURE="$2"
      shift
      shift
      ;;
    -s|--state)
      STATE="$2"
      shift
      shift
      ;;
    -u|--url)
      API_URL="$2"
      shift
      shift
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

# Validate inputs
if [[ -z "$FEATURE" ]]; then
  echo "Error: Feature name is required."
  show_help
  exit 1
fi

if [[ -z "$STATE" ]]; then
  echo "Error: Feature state is required."
  show_help
  exit 1
fi

if [[ "$STATE" != "true" && "$STATE" != "false" ]]; then
  echo "Error: State must be 'true' or 'false'."
  exit 1
fi

# Get current feature state for comparison
echo "Checking current feature state..."
CURRENT_STATE=$(curl -s "${API_URL}/api/features" | grep -o "\"${FEATURE}\".*\"enabled\":\s*[a-z]*" | grep -o 'true\|false')

if [[ -z "$CURRENT_STATE" ]]; then
  echo "Error: Could not retrieve current state for feature ${FEATURE}."
  exit 1
fi

echo "Current state of ${FEATURE} is: ${CURRENT_STATE}"

if [[ "$CURRENT_STATE" == "$STATE" ]]; then
  echo "Feature ${FEATURE} is already ${STATE}. No change needed."
  exit 0
fi

# Toggle the feature via the Togglz admin console
echo "Toggling feature ${FEATURE} to ${STATE}..."

# In a real scenario, this would use the Togglz API or admin console
# For this demo, we're using Spring environment variables
# Create a temporary .env file update
cat > .env.update <<EOF
TOGGLZ_FEATURES_${FEATURE}_ENABLED=${STATE}
EOF

# Apply the environment variables to the Docker container
echo "Applying new configuration without redeployment..."
docker compose --env-file .env.update up -d task-manager-api

# Verify the change
echo "Verifying the change..."
sleep 5  # Wait for the application to restart

NEW_STATE=$(curl -s "${API_URL}/api/features" | grep -o "\"${FEATURE}\".*\"enabled\":\s*[a-z]*" | grep -o 'true\|false')

if [[ "$NEW_STATE" == "$STATE" ]]; then
  echo "Success! Feature ${FEATURE} is now ${STATE}."
else
  echo "Error: Failed to toggle feature. Current state is ${NEW_STATE}, expected ${STATE}."
  exit 1
fi

echo "Feature toggled successfully without redeployment!"
echo "Check the Task Manager UI to see the changes in real-time."