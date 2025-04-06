# 🚀 Task Manager - Complete Deployment Documentation

## 💻 Tech Stack
- Node.js (Server) `FaNodeJs`
- Vite + React.js (Client) `FaReact`
- Docker `FaDocker`
- AWS EC2 (Ubuntu) `FaAws`
- GitHub Actions (CI/CD) `FaGithub`
- Nginx (Reverse Proxy) `SiNginx`

## 🌍 Project Architecture Overview `BiNetworkChart`
```
User -> Nginx (EC2) -> Client (Docker - Port: 5173)
                |
                -> Server API (Docker - Port: 5000)
```

## 🌱 Flow of Deployment `FaCodeBranch`
1. Developer pushes code to GitHub → main branch
2. GitHub Actions automatically triggers:
   a) Client Workflow:
      - Build React App
      - Create Docker Image
      - Push to DockerHub

   b) Server Workflow:
      - SSH into EC2
      - Pull latest images from DockerHub
      - Stop & Remove old containers
      - Run new containers (client + server)
      - Restart Nginx

## 🔑 EC2 SSH Key Setup Guide `BiKey`
### Generate SSH Key (on local)
```bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```
It will create:
- Private → ~/.ssh/id_rsa
- Public → ~/.ssh/id_rsa.pub

### Add Public Key to EC2
Paste id_rsa.pub into:
```bash
EC2 → ~/.ssh/authorized_keys
```

### Connect EC2 with Private Key
```bash
ssh -i ~/.ssh/id_rsa ec2-user@EC2_PUBLIC_IP
```

## 🐳 Install Docker on EC2 `FaDocker`
```bash
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -aG docker ec2-user
docker --version
```

Logout & Login Again:
```bash
exit
ssh -i ~/.ssh/id_rsa ec2-user@EC2_PUBLIC_IP
```

## 🤖 Setup Project on EC2 `FaServer`
```bash
cd ~
git clone YOUR_REPO_URL task-manager
cd task-manager
```

Directory Structure:
```bash
~/task-manager
├── client
└── server
```

## 🔐 Docker Login in EC2 `BiLock`
```bash
docker login
```
Add Docker Hub Credentials.

## 🐙 GitHub Actions Workflows `FaGithubAlt`
### 1. Client Workflow → .github/workflows/client-cicd.yml
Build Client and Push Image → DockerHub
```yaml
docker build -t rawattech/task-manager-client:latest ./client
docker push rawattech/task-manager-client:latest
```

### 2. Server Deploy Workflow → .github/workflows/server-cicd.yml
SSH into EC2, Pull Images, Restart Containers, Restart Nginx
```yaml
docker pull rawattech/task-manager-client:latest
docker pull rawattech/task-manager-server:latest

docker stop client-container || true
docker rm client-container || true
docker run -d --name client-container -p 5173:5173 rawattech/task-manager-client:latest

docker stop server-container || true
docker rm server-container || true
docker run -d --name server-container -p 5000:5000 rawattech/task-manager-server:latest

sudo systemctl restart nginx
```

## ⚙️ Nginx Config in EC2 `SiNginx`
Path → /etc/nginx/conf.d/default.conf
```nginx
server {
    listen 80;

    location / {
        proxy_pass http://localhost:5173;
    }

    location /api/ {
        proxy_pass http://localhost:5000/;
    }
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

## 🐳 Dockerfile for Client → client/Dockerfile `FaFileCode`
```Dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

RUN sed -i 's/listen       80;/listen       5173;/' /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
```

## 🔁 Final Flow Recap (Simple Words) `BiRefresh`
| Step | Action | Result |
|------|--------|--------|
| 1 | Push Code to Main | Trigger GitHub Actions |
| 2 | Client Action | Build + Push to DockerHub |
| 3 | Server Action | SSH → Pull Images → Restart Containers |
| 4 | Nginx | Handle Frontend + Backend Routing |

## 📝 Notes: `BiNotepad`
Don't forget to add all GitHub Secrets:
```
DOCKER_USERNAME
DOCKER_PASSWORD
EC2_HOST
EC2_USER
EC2_SSH_KEY
EC2_SSH_PASSPHRASE
```

### Future Improvements Ideas: `BiLightbulb`
- Use Docker Compose
- Use PM2 for Node App
- SSL Certificate with Certbot
- Automate Nginx Config from Actions
- Auto Rollback on Failure

## 📚 React-Icons Usage `FaReact`
This documentation uses icons from react-icons library. To use these icons in your React project:

```bash
npm install react-icons --save
```

Then import icons:
```jsx
import { FaReact, FaNodeJs, FaDocker, FaAws, FaGithub, FaGithubAlt, FaFileCode, FaServer } from 'react-icons/fa';
import { BiKey, BiLock, BiRefresh, BiNotepad, BiLightbulb, BiNetworkChart } from 'react-icons/bi';
import { SiNginx } from 'react-icons/si';
```

Example usage:
```jsx
<h1><FaReact /> React Component</h1>
``` 