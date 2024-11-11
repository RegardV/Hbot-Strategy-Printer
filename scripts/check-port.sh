#!/bin/bash

# Function to check if a port is in use
check_port() {
    nc -z localhost $1 > /dev/null 2>&1
    return $?
}

# Find first available port in range
start_port=3000
end_port=4000

for port in $(seq $start_port $end_port); do
    if ! check_port $port; then
        echo $port
        exit 0
    fi
done

echo "No available ports found in range $start_port-$end_port"
exit 1