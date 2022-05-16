import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Toolbar, Button, Box } from '@mui/material';
import { connectWallet, etherContext } from '../apis/use_wallet';

interface HeaderProps { }

export default function Header(props: HeaderProps) {

  const { currentAccount, setCurrentAccount} = useContext(etherContext);

  const NavTabs = [
    {
      name: 'example',
      to: '/example',
    }, 
    {
      name: 'devs',
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
        Vlike
        <Box sx={{ flex: 1 }} />

        {
          NavTabs.map(x => {
            return (
              <Button key={x.name}>
                <NavLink to={x.to} style={({isActive}) => ({
                  textDecoration: 'none',
                  // color: isActive ? "gray" : ""
                  // color: 'white'
                })}>{x.name}</NavLink>
              </Button>
            )
          })
        }

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