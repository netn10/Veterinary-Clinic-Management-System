# Deployment Guide

## Prerequisites
- Node.js 16+, PostgreSQL 12+, 2GB RAM, 10GB storage
- Linux server (Ubuntu 20.04+), Nginx, PM2, SSL certificate

## Quick Deployment

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql && sudo systemctl enable postgresql

# Install Nginx & PM2
sudo apt install nginx
sudo npm install -g pm2
```

### 2. Database Setup
```bash
# Create database user
sudo -u postgres psql
CREATE USER veterinary_user WITH PASSWORD 'secure_password';
CREATE DATABASE veterinary_clinic;
GRANT ALL PRIVILEGES ON DATABASE veterinary_clinic TO veterinary_user;
\q
```

### 3. Application Deployment
```bash
# Clone and setup
sudo mkdir -p /var/www/veterinary-clinic
sudo chown -R $USER:$USER /var/www/veterinary-clinic
cd /var/www/veterinary-clinic
git clone <repository-url> .

# Install and build
npm run install-all
npm run build

# Initialize database
cd server && npm run init-db && cd ..
```

### 4. Environment Configuration
Create `.env` file:
```env
NODE_ENV=production
PORT=3001
DB_USER=veterinary_user
DB_HOST=localhost
DB_NAME=veterinary_clinic
DB_PASSWORD=secure_password
DB_PORT=5432
CORS_ORIGIN=https://yourdomain.com
```

### 5. PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'veterinary-clinic',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production', PORT: 3001 }
  }]
}
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Nginx Configuration
Create `/etc/nginx/sites-available/veterinary-clinic`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Frontend
    location / {
        root /var/www/veterinary-clinic/client/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/veterinary-clinic /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 7. SSL Certificate
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 8. Security & Monitoring
```bash
# Firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 9. Database Backup
Create backup script:
```bash
#!/bin/bash
pg_dump -h localhost -U veterinary_user veterinary_clinic > backup_$(date +%Y%m%d).sql
```

Schedule backups:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

## Production Checklist
- [ ] Server requirements met
- [ ] Database configured
- [ ] SSL certificate installed
- [ ] Application running with PM2
- [ ] Nginx configured
- [ ] Firewall enabled
- [ ] Backups scheduled
- [ ] Monitoring configured

## Troubleshooting
```bash
# Check application logs
pm2 logs veterinary-clinic

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check database
sudo -u postgres psql -c "\l"
```
