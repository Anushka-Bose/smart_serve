# Backend Setup Guide

## Environment Configuration

Create a `.env` file in the `last-try-backend` directory with the following content:

```env
MONGODB_URL=mongodb+srv://thriti2607:dvT3edIOGSGk8yRD@cluster0.fvqqayn.mongodb.net/last-try?retryWrites=true&w=majority&appName=Cluster0
MONGODB_PASSWORD=dvT3edIOGSGk8yRD
PORT=4000
JWT_SECRET=why-my-secret
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=thriti2607@gmail.com
EMAIL_PASS=fzfg hfic vbcp qoab
WEATHER_API_KEY=efd3f399e885f7ad19c1e18170ad78df
CITY=Kolkata
BACKEND_URL=http://localhost:4000
```

## Quick Start

1. **Create the .env file** with the content above
2. **Install dependencies**: `npm install`
3. **Start the server**: `npm run dev`

## Troubleshooting

- Make sure MongoDB is accessible
- Check that port 4000 is available
- Verify all environment variables are set correctly
