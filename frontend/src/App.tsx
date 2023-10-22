import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import GoogleAuthButton from "./components/GoogleAuthButton";
import React from "react";
import EntriesComponent from "./components/Entries";

export const App = () => {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<GoogleAuthButton />} />
            <Route path="/entries" element={<EntriesComponent />} />  // Replace with your actual Entries component
          </Routes>
        </div>
      </Router>

  );
}