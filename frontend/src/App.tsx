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
      <Header/>
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
      <Footer/>
    </ThemeProvider>
  );
}

export default App;
