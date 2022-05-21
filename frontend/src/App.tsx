import { useState, useContext, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from './components/header';
import Footer from './components/footer';
import Msg from './components/msg';
import Examples from './pages/examples';
import Devs from './pages/devs/devs';
import Dashboard from "pages/dashboard/dashboard";
import Item from "pages/item";
import Faq from './pages/faq';
import './App.css';

import { useWallet, etherContext } from './apis/use_wallet';
import { useTokenContext, msgContext, useMsg } from './apis/hooks';
import { getTokenBalance } from './apis/ethereum';


const routes = [
  {
    name: 'examples',
    path: 'examples',
    element: Examples
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
  {
    name: 'dashboard',
    path: 'dashboard/:address/item/:id',
    element: Item,
  },
]

function App() {

  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const {
    currentAccount,
    setCurrentAccount,
    currentChain,
    SetCurrentChain,
    onRightChain
  } = useWallet();

  const [balance, setBalance] = useState(0);

  const handleSetTheme = (mode: 'light' | 'dark') => {
    setMode(mode);
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        }
      }),
    [mode]
  );

  const refreshToken = () => {
    if (currentAccount && onRightChain) {
      getTokenBalance().then(x => { // string
        try {
          const balanceInWei = parseInt(x);
          setBalance(balanceInWei / (10 ** 18));
        } catch (error) {
          console.error(error);
        }
      })
    } else {
      setBalance(0);
    }
  }

  useEffect(() => {
    refreshToken();
  }, [currentAccount, onRightChain])


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '108vh',
        display: 'flex',
        flexDirection: 'column'
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
            <Header handleSetTheme={handleSetTheme} />
            <Main />
          </useTokenContext.Provider>
        </etherContext.Provider>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;

function Main() {

  const { onRightChain } = useContext(etherContext);
  // const { show } = useContext(msgContext)
  const  {
    open,
    text,
    type,
    show,
    close,
  } = useMsg()

  return (
    <msgContext.Provider value={{
      open,
      text,
      type,
      show,
      close,
    }}>
      <Box sx={{ marginTop: 1, flexGrow: 1 }}>
        {
          (onRightChain === false) ? (
            <Alert severity="error" variant="filled" sx={{
              width: 'max-content',
            }}>
              Plasse connect to network {process.env.REACT_APP_CHAIN_NETWORK}.
            </Alert>
          ) : (
            <Routes>
              {
                routes.map(x => {
                  const Ele = x.element;
                  return (
                    <Route path={x.path} key={x.name} element={<Ele />} />
                  )
                })
              }
              <Route path='*' key='home' element={<Navigate to="/examples" replace />} />
            </Routes>
          )
        }
        <Msg open={open} text={text} type={type} close={close}></Msg>

      </Box>
    </msgContext.Provider>
  )
}
