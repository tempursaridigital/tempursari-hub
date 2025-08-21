# WAHA (WhatsApp HTTP API) Setup Guide

This guide will help you set up WAHA on your server at `34.83.178.21:3000` to send WhatsApp notifications for your Tempursari Hub application.

## What is WAHA?

WAHA (WhatsApp HTTP API) is an open-source solution that allows you to send and receive WhatsApp messages through HTTP API calls. Unlike the official WhatsApp Business API, WAHA doesn't require business verification and can be set up quickly.

## Prerequisites

- A server with Docker installed (your server: 34.83.178.21)
- Port 3000 available on your server
- A WhatsApp account (personal account works fine)

## Server Setup

### 1. Install Docker (if not already installed)

Connect to your server and install Docker:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Create WAHA Directory Structure

```bash
# Create directory for WAHA
mkdir -p ~/waha
cd ~/waha

# Create data directory for persistent storage
mkdir -p data
```

### 3. Create Docker Compose Configuration

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  waha:
    image: devlikeapro/waha:latest
    container_name: waha
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      # Optional: Set API key for security
      - WAHA_API_KEY=your_secure_api_key_here
      # Enable CORS for your frontend
      - WAHA_CORS_ENABLED=true
      - WAHA_CORS_ORIGIN=*
      # Optional: Enable dashboard
      - WAHA_DASHBOARD_ENABLED=true
      - WAHA_DASHBOARD_USERNAME=admin
      - WAHA_DASHBOARD_PASSWORD=admin123
    volumes:
      - ./data:/app/data
    command: ["node", "dist/main.js"]
```

### 4. Start WAHA Service

```bash
# Start WAHA
docker-compose up -d

# Check if it's running
docker-compose ps

# View logs
docker-compose logs -f waha
```

### 5. Configure Firewall (if needed)

Make sure port 3000 is accessible:

```bash
# For Ubuntu/Debian with UFW
sudo ufw allow 3000

# For CentOS/RHEL with firewalld
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

## WhatsApp Account Setup

### 1. Access WAHA Dashboard

Open your browser and go to: `http://34.83.178.21:3000/dashboard`

Login with:
- Username: `admin`
- Password: `admin123`

### 2. Create a Session

1. Click "Create Session" or "Add Session"
2. Enter session name: `default` (or any name you prefer)
3. Click "Create" or "Start Session"

### 3. Connect WhatsApp Account

1. After creating the session, you'll see a QR code
2. Open WhatsApp on your phone
3. Go to Settings > Linked Devices > Link a Device
4. Scan the QR code displayed in the dashboard
5. Wait for the status to change to "WORKING"

## API Testing

### 1. Test Server Health

```bash
curl -X GET http://34.83.178.21:3000/api/sessions
```

### 2. Test Sending a Message

```bash
curl -X POST http://34.83.178.21:3000/api/sendText \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secure_api_key_here" \
  -d '{
    "session": "default",
    "chatId": "6281234567890@c.us",
    "text": "Hello from WAHA!"
  }'
```

Replace `6281234567890` with the actual phone number (Indonesian format: 62 + number without leading 0).

## Application Configuration

### 1. Environment Variables

Update your `.env` file in the Tempursari Hub project:

```env
# WAHA Configuration
VITE_WAHA_URL=http://34.83.178.21:3000
VITE_WAHA_API_KEY=your_secure_api_key_here
VITE_WAHA_SESSION=default
```

### 2. Test Integration

The updated WhatsApp service in your application now includes these methods:

- `sendTextMessage()` - Send text messages
- `sendStatusUpdateNotification()` - Send status updates for service requests
- `sendImage()` - Send images with captions
- `sendDocument()` - Send documents/files
- `getSessionStatus()` - Check if WhatsApp session is active
- `startSession()` - Start a new WhatsApp session
- `checkServerHealth()` - Verify WAHA server connectivity

## Production Recommendations

### 1. Security

- Change default dashboard credentials
- Use a strong API key
- Restrict CORS origins to your domain only
- Consider using HTTPS with a reverse proxy (nginx)

### 2. Monitoring

Monitor your WAHA service:

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f waha

# Check resource usage
docker stats waha
```

### 3. Backup

Backup your session data regularly:

```bash
# Backup data directory
tar -czf waha-backup-$(date +%Y%m%d).tar.gz ./data
```

### 4. Updates

Keep WAHA updated:

```bash
# Pull latest image
docker-compose pull

# Restart with new image
docker-compose up -d
```

## Troubleshooting

### Common Issues

1. **QR Code doesn't appear**
   - Check if the session is created properly
   - Restart the container: `docker-compose restart waha`

2. **Messages not sending**
   - Verify phone number format (62xxxxxxxxx@c.us)
   - Check session status in dashboard
   - Verify API key if using authentication

3. **Session disconnected**
   - WhatsApp sessions can disconnect if inactive
   - Re-scan QR code in the dashboard
   - Check WhatsApp app on your phone for any notifications

4. **Server not accessible**
   - Check firewall settings
   - Verify Docker container is running
   - Check server logs: `docker-compose logs waha`

### Debug Commands

```bash
# Check WAHA container logs
docker-compose logs -f waha

# Check container status
docker-compose ps

# Restart WAHA
docker-compose restart waha

# Check API health
curl -X GET http://34.83.178.21:3000/api/sessions

# Test message sending
curl -X POST http://34.83.178.21:3000/api/sendText \
  -H "Content-Type: application/json" \
  -d '{
    "session": "default",
    "chatId": "62812345678901@c.us",
    "text": "Test message from WAHA"
  }'
```

## Advanced Configuration

### 1. Multiple Sessions

You can create multiple WhatsApp sessions for different purposes:

```bash
# Create business session
curl -X POST http://34.83.178.21:3000/api/sessions/start \
  -H "Content-Type: application/json" \
  -d '{
    "name": "business",
    "config": {
      "debug": false
    }
  }'
```

### 2. Webhooks (Optional)

Set up webhooks to receive incoming messages:

```yaml
# Add to docker-compose.yml environment
- WAHA_WEBHOOK_URL=http://your-app-domain.com/webhook/whatsapp
- WAHA_WEBHOOK_EVENTS=message,session.status
```

### 3. File Storage

For sending media files, you can:

1. Use public URLs (recommended for external files)
2. Upload files to WAHA and get local URLs
3. Use base64 encoded files (for small files)

## Support

- WAHA Documentation: https://waha.devlike.pro/
- GitHub Repository: https://github.com/devlikeapro/waha
- Docker Hub: https://hub.docker.com/r/devlikeapro/waha

## Integration with Tempursari Hub

Your application is now configured to use WAHA. The `whatsappService` will automatically:

1. Format Indonesian phone numbers correctly (add 62 prefix)
2. Send status update notifications
3. Handle connection errors gracefully
4. Provide session management capabilities

Test the integration by calling:

```typescript
import { whatsappService } from '@/services/whatsapp';

// Test server health
const health = await whatsappService.checkServerHealth();
console.log('WAHA Server Health:', health);

// Test sending a message
const result = await whatsappService.sendTextMessage('081234567890', 'Test message');
console.log('Message Result:', result);
```
