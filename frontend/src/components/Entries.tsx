import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
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
        <Box sx={{ margin: 2 }}>
            {events.map((event: any, index: number) => (
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
        </Box>
    );
}

export default EntriesComponent;