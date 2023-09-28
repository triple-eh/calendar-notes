import express from 'express';
import bodyParser from 'body-parser'; // if you use express < 4.16.0
import cors from 'cors';

// Import your routes here
// import eventRoutes from './routes/events';
// import noteRoutes from './routes/notes';

const app = express();

// Middlewares
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing application/json, use bodyParser.json() if you're using express < 4.16.0

// Apply your routes
// app.use('/events', eventRoutes);
// app.use('/notes', noteRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;