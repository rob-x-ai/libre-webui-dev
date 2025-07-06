# GitHub Actions Setup for Deployment

This document explains how to set up GitHub Actions for automated deployment of Libre WebUI to lwui.org.

## Required GitHub Secrets

To use the automated deployment workflows, you need to configure the following secrets in your GitHub repository:

### Navigation to Secrets

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Click on **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Required Secrets

#### `DEPLOY_HOST`

- **Description**: The IP address or hostname of your production server
- **Example**: `123.456.789.0` or `lwui.org`

#### `DEPLOY_USER`

- **Description**: The username for SSH access to your production server
- **Example**: `root` or `deploy`

#### `DEPLOY_SSH_KEY`

- **Description**: The private SSH key for accessing your production server
- **Setup**:

  ```bash
  # Generate SSH key pair on your local machine
  ssh-keygen -t rsa -b 4096 -C "deploy@lwui.org"

  # Copy the public key to your server
  ssh-copy-id -i ~/.ssh/id_rsa.pub user@your-server

  # Copy the private key content to GitHub secrets
  cat ~/.ssh/id_rsa
  ```

#### `JWT_SECRET`

- **Description**: A secure random string for signing JWT tokens
- **Generation**:
  ```bash
  # Generate a secure random string
  openssl rand -hex 32
  ```

## Environments Setup

### Create Production Environment

1. Go to your repository **Settings**
2. Click on **Environments**
3. Click **New environment**
4. Name it `production`
5. Add protection rules if needed (e.g., required reviewers)

## Workflow Files

### 1. `docker-build.yml`

- **Trigger**: Push to main branch or pull requests
- **Purpose**: Build and push Docker image to GitHub Container Registry
- **Secrets needed**: None (uses `GITHUB_TOKEN` automatically)

### 2. `manual-deploy.yml`

- **Trigger**: Manual workflow dispatch
- **Purpose**: Deploy manually to production or staging
- **Secrets needed**: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `JWT_SECRET`

### 3. `deploy.yml`

- **Trigger**: After successful build workflow
- **Purpose**: Automatic deployment to production
- **Secrets needed**: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `JWT_SECRET`

## Server Setup

### 1. Prepare Production Server

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create deployment directory
sudo mkdir -p /opt/libre-webui
sudo chown -R $USER:$USER /opt/libre-webui
```

### 2. Clone Repository on Server

```bash
cd /opt/libre-webui
git clone https://github.com/your-username/libre-webui.git .
chmod +x scripts/*.sh
```

### 3. Configure SSL (if using nginx)

```bash
# Install certbot
sudo apt-get install certbot

# Generate SSL certificate
sudo certbot certonly --standalone -d lwui.org

# Create SSL directory
mkdir -p ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/lwui.org/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/lwui.org/privkey.pem ssl/key.pem
sudo chown -R $USER:$USER ssl/
```

## Manual Deployment

### Using GitHub Actions UI

1. Go to your repository
2. Click on **Actions** tab
3. Select **Manual Deploy** workflow
4. Click **Run workflow**
5. Choose environment (production/staging)
6. Click **Run workflow**

### Using Command Line

```bash
# Trigger manual deployment via GitHub CLI
gh workflow run manual-deploy.yml -f environment=production
```

## Monitoring Deployments

### View Workflow Status

- Check the **Actions** tab in your GitHub repository
- Each workflow run shows detailed logs

### Check Server Status

```bash
# SSH into your server
ssh user@your-server

# Check container status
cd /opt/libre-webui
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Verify `DEPLOY_HOST` is correct
   - Ensure SSH key is properly configured
   - Check if the server is accessible

2. **Permission Denied**
   - Verify `DEPLOY_USER` has proper permissions
   - Check if user is in docker group
   - Ensure deployment directory permissions

3. **Docker Build Failed**
   - Check the build logs in Actions tab
   - Verify Dockerfile syntax
   - Ensure all dependencies are available

4. **Deployment Script Failed**
   - Check if `JWT_SECRET` is set
   - Verify deployment script permissions
   - Check server resources (disk space, memory)

### Debug Commands

```bash
# Check GitHub Actions logs
# Available in the Actions tab of your repository

# Check server deployment logs
ssh user@your-server
cd /opt/libre-webui
docker-compose -f docker-compose.production.yml logs

# Check container health
docker ps
docker inspect container_name
```

## Security Considerations

1. **SSH Key Security**
   - Use a dedicated SSH key for deployment
   - Restrict SSH key permissions on server
   - Regularly rotate SSH keys

2. **Secrets Management**
   - Never commit secrets to repository
   - Use GitHub encrypted secrets
   - Regularly rotate JWT secrets

3. **Server Security**
   - Keep server updated
   - Configure firewall properly
   - Monitor access logs

## Best Practices

1. **Environment Separation**
   - Use different environments for staging/production
   - Test deployments on staging first

2. **Monitoring**
   - Set up monitoring for your application
   - Configure alerts for failed deployments

3. **Backup**
   - Regular backups of data volumes
   - Test backup restoration procedures

4. **Documentation**
   - Keep deployment documentation updated
   - Document any custom configurations
