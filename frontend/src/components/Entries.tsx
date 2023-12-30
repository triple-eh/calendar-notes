import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {formatDateString} from "../utils/utils";

function EntriesComponent() {
    const [events, setEvents]: [any, any] = useState([]);

    useEffect(() => {
        async function fetchCalendarEvents() {
            try {
                const response = await fetch('http://localhost:5000/api/calendar/events', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEvents(data);
                return data;
            } catch (error) {
                console.error('Failed to fetch calendar events:', error);
            }
        }

        fetchCalendarEvents().then(data => {
            console.log(data);
        })
    }, []);

    return (
        <Box sx={{ flexGrow: 1, margin: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    {events.map((event: any, index: any) => (
                        <Card key={index} sx={{ marginBottom: 2, backgroundColor: '#f5f5f5' }}>
                            <CardContent>
                                <Typography variant="h6">
                                    {event.name}
                                </Typography>
                                <Typography color="textSecondary">
                                    {formatDateString(event.date)}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
                <Grid item xs={9}>
                    <TextField
                        label="Notes"
                        multiline
                        rows={22}
                        defaultValue="Add your notes here..."
                        variant="outlined"
                        fullWidth
                        sx={{ height: '100%' }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default EntriesComponent;