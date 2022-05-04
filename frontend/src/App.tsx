import './App.css';
import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from './components/header';
import Footer from './components/footer';
import Demo from './pages/demo';
import Devs from './pages/devs';
import Faq from './pages/faq';

const theme = createTheme();

function App() {

  const routes = [
    {
      path: 'demo',
      element: Demo,
    },
    {
      path: 'devs',
      element: Devs,
    },
    {
      path: 'faq',
      element: Faq,
    },
  ]

  return (
    <ThemeProvider theme={theme}>
      <Header/>
        <Routes>
          {
            routes.map(x => {
              const Ele = x.element;
              return (
                <Route path={x.path} element={<Ele />} />
              )
            })
          }
        </Routes>
      <Footer/>
    </ThemeProvider>
  );
}

export default App;
