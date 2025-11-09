# GitHub Setup Guide

## Step 1: Configure Git Identity

Before committing, you need to tell Git who you are:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and GitHub email address.

## Step 2: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `GeoShield` (or any name you prefer)
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 3: Connect and Push

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Add Git to PATH (if not already done)
$env:PATH += ";C:\Program Files\Git\bin"

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/GeoShield.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```powershell
git remote add origin git@github.com:YOUR_USERNAME/GeoShield.git
git branch -M main
git push -u origin main
```

## Troubleshooting

- **Authentication required**: GitHub may ask for credentials. Use a Personal Access Token instead of password:
  1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token with "repo" permissions
  3. Use the token as your password when pushing

- **Repository already exists**: If you get an error about the remote already existing:
  ```powershell
  git remote remove origin
  git remote add origin https://github.com/YOUR_USERNAME/GeoShield.git
  ```

