#!/bin/bash

# Initialize git repository
echo "Initializing git repository..."
git init

# Add all files
echo "Adding files to git..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: Proxmox Management UI"

# Rename the default branch to main
echo "Renaming branch to main..."
git branch -M main

# Add the remote repository
echo "Adding remote repository..."
git remote add origin https://github.com/atp-adarshtp/react-project.git

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "GitHub setup complete!" 