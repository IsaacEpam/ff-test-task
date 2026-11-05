#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
FLAGS_URL="${BASE_URL%/}/flags"

create_flag() {
  local name="$1"
  local value="$2"

  echo "Creating $name..."

  curl --silent --show-error --fail \
    --request POST "$FLAGS_URL" \
    --header 'Content-Type: application/json' \
    --data "{\"name\":\"$name\",\"type\":\"boolean\",\"value\":$value}"

  echo
}

create_flag "new-dashboard" true
create_flag "beta-checkout" false
create_flag "email-notifications" true
create_flag "dark-mode" false

echo "Done."