import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import GoogleAuthButton from "./components/GoogleAuthButton";
import React from "react";
import EntriesComponent from "./components/Entries";
import CssBaseline from '@mui/material/CssBaseline';

export const App = () => {
  return (
      <>
          <CssBaseline />
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<GoogleAuthButton />} />
                <Route path="/entries" element={<EntriesComponent />} />  // Replace with your actual Entries component
              </Routes>
            </div>
          </Router>
      </>

  );
}