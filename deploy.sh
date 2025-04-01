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

# Set up Nginx configuration
echo "Setting up Nginx configuration..."
cat << EOF | ssh root@88.198.18.234 'cat > /etc/nginx/sites-available/proxmox-ui'
server {
    listen 80;
    server_name 88.198.18.234;

    root /var/www/proxmox-ui;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site and restart Nginx
echo "Enabling site and restarting Nginx..."
ssh root@88.198.18.234 'ln -sf /etc/nginx/sites-available/proxmox-ui /etc/nginx/sites-enabled/ && nginx -t && systemctl restart nginx'

echo "Deployment complete!" 