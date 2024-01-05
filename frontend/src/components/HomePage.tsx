import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

const HomePage = () => {
    return (
        <Container>
            <Box textAlign="center" my={4}>
                <Typography variant="h2" gutterBottom>
                    Calendar Notes
                </Typography>
                <Typography variant="h6" color="textSecondary" paragraph>
                    Welcome to Calendar Notes! Import your Google Calendar entries and annotate them.
                    Use it as a prompt to journal or to add pertinent information to your entries.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.location.href='http://localhost:5000/auth/google'}
                >
                    Import Google Calendar Entries
                </Button>
            </Box>
        </Container>
    );
};

export default HomePage;