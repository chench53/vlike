import * as React from 'react';
import './App.css';
import Header from './components/header';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
        <Header/>
    </ThemeProvider>

  );
}

export default App;
