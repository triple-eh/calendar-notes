import React from 'react';

const GoogleAuthButton = () => {
    return (
        <button onClick={() => window.location.href='http://localhost:5000/auth/google'}>
            Get Google Calendar Entries
        </button>
    );
}

export default GoogleAuthButton;