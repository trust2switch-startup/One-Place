import express from 'express';
import serverApp from './server/server.js';

// Vercel detects Express from a root entry point that creates and exports an app.
const app = express();
app.use(serverApp);

export default app;
