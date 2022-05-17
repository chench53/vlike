import { useState, useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from './components/header';
import Footer from './components/footer';
import Demo from './pages/demo';
import Devs from './pages/devs/devs';
import Dashboard from "pages/dashboard/dashboard";
import Faq from './pages/faq';
import './App.css';

import { useWallet, etherContext } from './apis/use_wallet';
import { useTokenContext } from './apis/hooks';
import { getTokenBalance } from './apis/ethereum';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const routes = [
  {
    name: 'example',
    path: 'example',
    element: Demo
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

  const [ balance, setBalance ] = useState(0);

  useEffect(() => {
    refreshToken();
  }, [currentAccount, onRightChain])
  
  const refreshToken = () => {
    console.log(currentAccount)
    console.log(onRightChain)
    if (currentAccount && onRightChain) {
      getTokenBalance().then(x => { // string
        try {
          const balanceInWei = parseInt(x);
          setBalance(balanceInWei/(10**18));
        } catch (error) {
          console.error(error);
        }
      })
    } else {
      setBalance(0);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}>
        <etherContext.Provider value={{
          currentAccount,
          setCurrentAccount,
          currentChain,
          SetCurrentChain,
          onRightChain,
        }}>
          <useTokenContext.Provider value={{
            balance: balance,
            refreshToken: refreshToken
          }}>
            <Header />
            <Main />
          </useTokenContext.Provider>
          <Footer />
        </etherContext.Provider>
      </Box>
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
          <Route path='*' key='home' element={<Navigate to="/example" replace />} />
        </Routes>
      </Box>
    )
  }
}
