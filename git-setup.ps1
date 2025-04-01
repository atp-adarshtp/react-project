# Initialize git repository
Write-Host "Initializing git repository..."
git init

# Add all files
Write-Host "Adding files to git..."
git add .

# Create initial commit
Write-Host "Creating initial commit..."
git commit -m "Initial commit: Proxmox Management UI"

# Rename the default branch to main
Write-Host "Renaming branch to main..."
git branch -M main

# Add the remote repository
Write-Host "Adding remote repository..."
git remote add origin https://github.com/atp-adarshtp/react-project.git

# Push to GitHub
Write-Host "Pushing to GitHub..."
git push -u origin main

Write-Host "GitHub setup complete!" 