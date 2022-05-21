import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Toolbar, Button, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import TokensButton from './tokens_btn';
import { connectWallet, etherContext } from 'apis/use_wallet';

interface HeaderProps { 
  handleSetTheme: (arg0: 'light' | 'dark') => void
}

export default function Header(props: HeaderProps) {

  const { handleSetTheme } = props;
  const { currentAccount, setCurrentAccount } = useContext(etherContext);
  const { palette } = useTheme()

  const NavTabs = [ 
    {
      name: 'Examples',
      to: '/examples',
    },
    {
      name: 'Devs',
      to: '/devs',
    },
    {
      name: 'FAQ',
      to: '/faq',
    },
  ]

  return (
    <Box>
      <Toolbar sx={{
        borderBottom: 1,
        borderColor: 'divider',
      }}>
        <Typography variant="h5">
          <NavLink className={palette.mode} to="/" style={{ textDecoration: 'none' }}>
            Vlike
          </NavLink>
        </Typography>

        <Box sx={{ flex: 1 }} />
        <div className="headerdiv">
          <input type="checkbox" className="checkbox" id="chk" onChange={e => {
            handleSetTheme(e.target.checked ? 'light':'dark')
          }}/>
          <label className="label" htmlFor="chk">
            <LightModeIcon className="licon" />
            <DarkModeIcon className="dicon" />
            <div className="ball"></div>
          </label>
        </div>
       
        {
          NavTabs.map(x => {
            return (
              <Typography variant="subtitle1" key={x.name} sx={{
                marginRight: 4,
              }}>
                <NavLink className={palette.mode} to={x.to} style={(isActive) => ({
                  textDecoration: 'none',
                  // color: isActive ? "gray" : "",
                    // color: 'white'
                })}>{x.name}</NavLink>
              </Typography>
            )
          })
          }
          

        <TokensButton></TokensButton>

        {(currentAccount && setCurrentAccount) ? (
          <Button variant='outlined'>
            {`${currentAccount.slice(0, 5)}...${currentAccount.slice(38)}`}
          </Button>
        ) : <Button variant='outlined' onClick={() => { connectWallet(setCurrentAccount) }} > connect </Button>
        }

      </Toolbar>
    </Box>
  );
}
