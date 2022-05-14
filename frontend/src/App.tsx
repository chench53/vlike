import { useContext } from 'react';
import { Routes, Route } from "react-router-dom";
import { Box, Container, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useWallet, etherContext } from './apis/use_wallet';
import Header from './components/header';
import Footer from './components/footer';
import Demo from './pages/demo';
import Devs from './pages/devs/devs';
import Dashboard from "pages/dashboard/dashboard";
import Faq from './pages/faq';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const routes = [
  {
    name: 'demo',
    path: 'demo',
    element: Demo,
  },
  {
    name: 'devs',
    path: 'devs',
    element: Devs,
  },
  {
    name: 'faq',
    path: 'faq',
    element: Faq,
  },
  {
    name: 'dashboard',
    path: 'dashboard/:contractAddress',
    element: Dashboard,
  },
]

function App() {
  const {
    currentAccount,
    setCurrentAccount,
    currentChain,
    SetCurrentChain,
    onRightChain
  } = useWallet();


  return (
    <ThemeProvider theme={theme}>
      <etherContext.Provider value={{
        currentAccount,
        setCurrentAccount,
        currentChain,
        SetCurrentChain,
        onRightChain,
      }}>
        <Box sx={{
          bgcolor: 'background.default', 
          color: 'text.primary',
          minHeight: '100vh',
          }}>
          <Header />
          <Main />
          <Footer />
        </Box>
      </etherContext.Provider>
    </ThemeProvider>
  );
}

export default App;

function Main() {

  const { onRightChain } = useContext(etherContext);

  if (onRightChain === false) {
    return (
      <Alert severity="error">
      plasse connect to network {process.env.REACT_APP_CHAIN_NETWORK}
    </Alert>
    )
  } else {
    return (
      <Box sx={{ marginTop: 1 }}>
        <Routes>
          {
            routes.map(x => {
              const Ele = x.element;
              return (
                <Route path={x.path} key={x.name} element={<Ele />} />
              )
            })
          }
        </Routes>
      </Box>
    )
  }
}
