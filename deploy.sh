#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Create deployment directory if it doesn't exist
echo "Creating deployment directory..."
ssh root@88.198.18.234 'mkdir -p /var/www/proxmox-ui'

# Copy the built files to the server
echo "Copying files to server..."
scp -r dist/* root@88.198.18.234:/var/www/proxmox-ui/

# Set proper permissions
echo "Setting permissions..."
ssh root@88.198.18.234 'chown -R www-data:www-data /var/www/proxmox-ui'

echo "Deployment complete!" 