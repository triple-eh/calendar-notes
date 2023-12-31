import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {formatDateString} from "../utils/utils";
import {Button, styled} from "@mui/material";

const StyledButton = styled(Button)({
    borderColor: 'darkblue',
    color: 'darkblue',
    marginTop: '8px',
    float: 'right',
    '&:hover': {
        borderColor: 'darkerblue',
        backgroundColor: 'lightblue',
    },
});

function EntriesComponent() {
    const [events, setEvents]: [any, any] = useState([]);
    const [activeEntryId, setActiveEntryId] = useState(null);
    const [activeEntryContent, setActiveEntryContent] = useState("");

    useEffect(() => {
        async function fetchCalendarEvents() {
            try {
                const response = await fetch('http://localhost:5000/api/entries', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEvents(data);
                setActiveEntryId(data[0]?.id);
                setActiveEntryContent(data[0]?.content);
                return data;
            } catch (error) {
                console.error('Failed to fetch calendar events:', error);
            }
        }

        fetchCalendarEvents().then(data => {
            console.log(data);
        })
    }, []);

    const handleCardClick = (event: any) => {
        setActiveEntryId(event.id);
        setActiveEntryContent(event.content);
    };

    const handleEntryUpdate = (content: string): void => {
        setActiveEntryContent(content);
        events.find((event: any) => event.id == activeEntryId).content = content;
    }

    const persistEntryUpdate = async (content: string) => {
        try {
            const response = await fetch(`/api/entries/${activeEntryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Update successful:', responseData.message);
            } else {
                console.error('Update failed:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error sending update:', error);
        }
    }

    return (
        <Box sx={{ flexGrow: 1, margin: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    {events.map((event: any, index: any) => (
                        <Card key={index}
                              sx={{
                                  marginBottom: 2,
                                  backgroundColor: event.id === activeEntryId ? '#ADD8E6' : '#f5f5f5',
                                  cursor: "pointer"
                                }}
                                onClick={()=> handleCardClick(event)}>
                            <CardContent>
                                <Typography variant="h6">
                                    {event.name}
                                </Typography>
                                <Typography color="textSecondary">
                                    {formatDateString(event.timestamp)}
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
                        value={activeEntryContent}
                        onChange={(e) => handleEntryUpdate(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <StyledButton
                        variant="outlined"
                        onClick={() => persistEntryUpdate(activeEntryContent)}
                    >
                        Save
                    </StyledButton>
                </Grid>
            </Grid>
        </Box>
    );
}

export default EntriesComponent;