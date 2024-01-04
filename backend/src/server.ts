import express, {Express} from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import passport from 'passport';
import crypto from 'crypto';
import { google } from 'googleapis';
import {EntryPersistenceManager} from "./controllers/EntryPersistenceManager";
import {EventNote} from "./controllers/EventNote";

require('dotenv').config();

const app: Express = express();

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "http://localhost:5000/auth/google/callback"
}, (accessToken: any, refreshToken: any, profile: any, done: any) => {
    console.log('AccessToken:', accessToken);
    // console.log('RefreshToken:', refreshToken);
    // console.log('Profile:', profile);
    if (!profile) {
        return done(new Error("No profile returned"));
    }
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    return done(null, profile);
}));

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(session({
    secret: crypto.randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    // console.log("Serializing user: ", user);
    cb(null, user);
});

passport.deserializeUser(function(user: any, cb) {
    // console.log("Deserializing user: ", user);
    cb(null, user);
});

// Routes

app.get('/auth/google',
    passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        accessType: 'offline'
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect : 'http://localhost:5000/api/calendar/events',
        failureRedirect : '/authFailed',
        failureFlash: 'Invalid Google credentials.'
    })
);

app.get('/api/events', async (req: any, res) => {
    const persistenceManager = new EntryPersistenceManager();
    const events = await persistenceManager.readEvents();

    console.log(`returning ${events.length} events`);

    res.json(events.map(event => {
        return {
            name: event.name,
            timestamp: event.timestamp
        };
    }))
})

app.get('/api/calendar/events', async (req: any, res) => {
    if (!req.user || !req.user.accessToken) {
        return res.status(401).send('Not authorized');
    }

    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_SECRET,
        "http://localhost:5000/auth/google/callback");

    client.setCredentials({
        access_token: req.user.accessToken
    });

    console.log("Token used for calendar is:", req.user.accessToken);
    const calendar = google.calendar({ version: 'v3', auth: client });

    try {
        const now = new Date();
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(now.getDate() - 14);

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: twoWeeksAgo.toISOString(),
            timeMax: now.toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        });


        const events: EventNote[] = response && response.data.items ? response.data.items.map(event => {
            return new EventNote(event.summary as string, (event.start?.dateTime || event.start?.date) as string)
        }) : [];

        const persistenceManager = new EntryPersistenceManager();
        persistenceManager.writeAllEvents(events);

        res.redirect("http://localhost:3000/entries");
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        res.status(500).send('Failed to fetch calendar events');
    }
});

app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;