# MongoDB Setup Guide

## Option 1: Install MongoDB Locally (Recommended for Development)

### Windows Installation:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Make sure to install MongoDB as a Windows Service
4. MongoDB will automatically start on port 27017

### Start MongoDB Service:
```bash
# Start MongoDB service
net start MongoDB

# Stop MongoDB service  
net stop MongoDB
```

## Option 2: Use MongoDB Atlas (Cloud Database)

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Update the `MONGODB_URI` in `.env.local` with your Atlas connection string

Example Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tsvweb?retryWrites=true&w=majority
```

## Option 3: Use Docker (Alternative)

```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Stop MongoDB container
docker stop mongodb

# Start existing container
docker start mongodb
```

## Verify Connection

After setting up MongoDB, restart your Next.js development server:
```bash
npm run dev
```

You should see "✅ Connected to MongoDB successfully" in the console if the connection works.
