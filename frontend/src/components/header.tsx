import { NavLink } from "react-router-dom";
import { Toolbar, Button, Box } from '@mui/material';
import { connectWallet, useWallet } from '../apis/use_wallet';

interface HeaderProps { }

export default function Header(props: HeaderProps) {
  const { } = props;
  const { currentAccount, setCurrentAccount } = useWallet();

  const NavTabs = [
    {
      name: 'demo',
      to: '/demo',
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
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider'}}>
        Vlike
        <Box sx={{ flex: 1 }} />

        {
          NavTabs.map(x => {
            return (
              <Button key={x.name} color="secondary">
                <NavLink to={x.to} style={({isActive}) => ({
                  textDecoration: 'none',
                  color: isActive ? "gray" : ""
                })}>{x.name}</NavLink>
              </Button>
            )
          })
        }

        {currentAccount ? (
          <Button variant='outlined'>
            {`${currentAccount.slice(0, 5)}...${currentAccount.slice(38)}`}
          </Button>
        ) : <Button variant='outlined' onClick={() => { connectWallet(setCurrentAccount) }} > connect </Button>
        }

      </Toolbar>
    </Box>
  );
}