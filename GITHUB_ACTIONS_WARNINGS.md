# GitHub Actions Deployment Warnings - How to Fix

## Understanding the Warnings

If you see warnings like "Context access might be invalid: DEPLOY_HOST" in your GitHub Actions workflow files, these are **expected** and will disappear once you configure the required secrets in your GitHub repository.

## Why These Warnings Appear

VS Code's GitHub Actions extension checks if the secrets exist in your local environment, but GitHub Actions secrets are only available in the GitHub repository settings, not in your local development environment.

## How to Fix the Warnings

### Step 1: Configure GitHub Repository Secrets

1. **Go to your GitHub repository**
2. **Click on "Settings" tab**
3. **Navigate to "Secrets and variables" → "Actions"**
4. **Click "New repository secret"**

### Step 2: Add Required Secrets

Add the following secrets one by one:

#### `DEPLOY_HOST`

- **Description**: Your server's IP address or hostname
- **Example**: `123.456.789.0` or `lwui.org`
- **How to get**: This is your production server's public IP or domain

#### `DEPLOY_USER`

- **Description**: SSH username for your server
- **Example**: `root`, `ubuntu`, or `deploy`
- **How to get**: The username you use to SSH into your server

#### `DEPLOY_SSH_KEY`

- **Description**: Private SSH key for server access
- **How to generate**:

  ```bash
  # On your local machine
  ssh-keygen -t rsa -b 4096 -C "deploy@lwui.org"

  # Copy public key to your server
  ssh-copy-id -i ~/.ssh/id_rsa.pub user@your-server

  # Copy private key content for GitHub secret
  cat ~/.ssh/id_rsa
  ```

- **Value**: The entire content of your private SSH key file

#### `JWT_SECRET`

- **Description**: Secure random string for JWT token signing
- **How to generate**:
  ```bash
  openssl rand -hex 32
  ```
- **Value**: A 64-character hexadecimal string

### Step 3: Verify Configuration

Once you've added all secrets:

1. **Go to "Actions" tab in your repository**
2. **Run the "Deploy to Production" workflow**
3. **The warnings should be gone**

## Alternative: Use Build-Only Workflow

If you prefer not to set up deployment secrets immediately, you can use the `build-only.yml` workflow:

1. **Only builds and pushes Docker images**
2. **No secrets required** (uses GitHub token automatically)
3. **No warnings** about missing secrets

## Manual Deployment Option

If you prefer to deploy manually:

1. **Use the build-only workflow** to build images
2. **SSH into your server manually**:
   ```bash
   ssh user@your-server
   cd /opt/libre-webui
   git pull origin main
   export JWT_SECRET="your-secret-here"
   ./scripts/deploy.sh
   ```

## Workflow Files Explanation

### `docker-build.yml`

- **Purpose**: Build and push Docker images
- **Secrets required**: None
- **Triggers**: Push to main, pull requests

### `build-only.yml`

- **Purpose**: Simple build without deployment
- **Secrets required**: None
- **Triggers**: Push to main, pull requests

### `deploy.yml`

- **Purpose**: Deploy to production server
- **Secrets required**: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `JWT_SECRET`
- **Triggers**: Manual workflow dispatch

### `manual-deploy.yml`

- **Purpose**: Manual deployment with environment selection
- **Secrets required**: Same as deploy.yml
- **Triggers**: Manual workflow dispatch

## Common Issues and Solutions

### 1. "Context access might be invalid" warnings

- **Solution**: Add the required secrets to your GitHub repository
- **Status**: These are warnings, not errors - the workflow will work once secrets are configured

### 2. SSH connection failures

- **Check**: Ensure your SSH key is properly configured on the server
- **Check**: Verify the server IP/hostname is correct
- **Test**: Try connecting manually: `ssh user@your-server`

### 3. Permission denied errors

- **Check**: Ensure the SSH user has proper permissions
- **Check**: Verify the user is in the docker group: `sudo usermod -aG docker user`

### 4. JWT_SECRET not working

- **Check**: Ensure the secret is properly set in GitHub
- **Check**: Verify the secret is exported in the deployment script
- **Test**: Check if the secret is available: `echo $JWT_SECRET`

## Testing Your Setup

1. **Test SSH connection**:

   ```bash
   ssh user@your-server
   ```

2. **Test Docker on server**:

   ```bash
   docker ps
   docker-compose version
   ```

3. **Test deployment script**:
   ```bash
   cd /opt/libre-webui
   export JWT_SECRET="test-secret"
   ./scripts/validate-docker.sh
   ```

## Next Steps

1. **Configure all required secrets** in your GitHub repository
2. **Test the deployment** using the manual workflow
3. **Monitor the deployment** in the Actions tab
4. **Check your application** at https://lwui.org

## Need Help?

- **Check the Actions tab** for detailed logs
- **Review the server logs**: `docker-compose logs -f`
- **Validate your setup**: Run `./scripts/validate-docker.sh`
- **Test manually**: Try the deployment steps one by one

The warnings you see are normal and expected until you configure the secrets in your GitHub repository. The workflows are syntactically correct and will work properly once the secrets are set up.
