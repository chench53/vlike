import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from './components/header';
import Home from './pages/home';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
        <Header/>
        <Home/>
    </ThemeProvider>
  );
}

export default App;
