import './App.css';
import { Routes, Route } from "react-router-dom";
import { Box, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useWallet } from './apis/use_wallet';
import Header from './components/header';
import Footer from './components/footer';
import Demo from './pages/demo';
import Devs from './pages/devs/devs';
import Faq from './pages/faq';

const theme = createTheme();

function App() {

  const { currentAccount, currentChain } = useWallet();

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
  ]

  return (
    <ThemeProvider theme={theme}>
      <Header />
      {
        (currentAccount && currentChain && (currentChain !== process.env.REACT_APP_CHAIN_NETWORK)) ?
          <Alert severity="error">
            plasse connect to network {process.env.REACT_APP_CHAIN_NETWORK}
          </Alert>
          :
          <Box sx={{marginTop: 4}}>
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
      }
      <Footer />
    </ThemeProvider>
  );
}

export default App;
