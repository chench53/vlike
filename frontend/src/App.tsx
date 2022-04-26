import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/home';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header/>
      <Home />
      <Footer/>
    </ThemeProvider>
  );
}

export default App;
