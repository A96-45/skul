# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated building and releasing of Skola.

## 🚀 Release Workflow (`release.yml`)

**Triggers:** When a new GitHub release is published

**What it does:**
1. Builds and pushes Docker images to Docker Hub (`a96-45/skola-backend` and `a96-45/skola-frontend`)
2. Creates versioned release assets:
   - `skola-installer-{version}.sh` - Desktop installer script
   - `skola-docker-compose-{version}.yml` - Docker Compose configuration
   - `build-mobile-instructions-{version}.md` - Instructions for building mobile apps

### Required Secrets

Add these secrets to your GitHub repository settings:

#### Docker Hub Credentials
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token (not password)

**To create a Docker Hub access token:**
1. Go to https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Give it a name like "GitHub Actions"
4. Copy the token and add it to GitHub secrets

## 📱 Mobile App Builds

Mobile app builds (APK/IPA) are not automated due to EAS build complexities and Apple Developer requirements. Instead:

1. The release workflow creates `build-mobile-instructions-{version}.md`
2. Follow those instructions to build APK/IPA manually
3. Upload the APK/IPA files to the GitHub release

## 🔧 Manual Workflows

### Build Docker Images Only
If you want to build Docker images without creating a release:

```yaml
name: Build Docker Images
on: workflow_dispatch

jobs:
  build-docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build backend
        run: docker build -t a96-45/skola-backend:test ./backend
      - name: Build frontend
        run: docker build -t a96-45/skola-frontend:test -f Dockerfile.frontend .
```

## 📋 Usage

### Creating a Release

1. **Prepare your code** - Ensure everything is tested and ready
2. **Update version** - Update `package.json` and `app.json` if needed
3. **Create git tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. **Create GitHub release**:
   - Go to GitHub → Releases → "Create a new release"
   - Select your tag (e.g., `v1.0.0`)
   - Add release notes
   - Publish the release

5. **Workflow will run automatically** and add assets to your release

### Release Assets

After the workflow completes, your release will contain:
- 🐳 Docker images on Docker Hub
- 📜 Desktop installer script
- ⚙️ Docker Compose configuration
- 📱 Mobile build instructions
- 📦 APK/IPA files (after you manually build and upload them)

## 🐛 Troubleshooting

### Workflow fails with "Docker login failed"
- Check your `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets
- Ensure the token has write permissions

### Release assets not uploading
- Check that the release was created with "published" status
- Verify the workflow has access to `GITHUB_TOKEN`

### Docker build fails
- Check the Dockerfile syntax
- Ensure all required files are in the repository
- Check build logs in the Actions tab
