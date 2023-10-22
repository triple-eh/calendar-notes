import React, { useEffect, useState } from 'react';

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
        <div>
            {events.map((event: any, index: any) => (
                <div key={index}>
                    <h3>{event.name}</h3>
                    <p>{event.date}</p>
                </div>
            ))}
        </div>
    );
}

export default EntriesComponent;