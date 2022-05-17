import { useState, useContext, MouseEvent } from "react";
import { NavLink } from "react-router-dom";
import { Toolbar, Button, Box, Popover } from '@mui/material';

import { connectWallet, etherContext } from 'apis/use_wallet';
import { useTokenContext } from 'apis/hooks';
import { requestTokens } from 'apis/ethereum';

interface HeaderProps { }

export default function Header(props: HeaderProps) {

  const { currentAccount, setCurrentAccount} = useContext(etherContext);

  const NavTabs = [
    {
      name: 'Examples',
      to: '/example',
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
          <NavLink to="/" style={{textDecoration: 'none'}}>
            Vlike
          </NavLink>
        <Box sx={{ flex: 1 }} />

        {
          NavTabs.map(x => {
            return (
              <Button key={x.name} sx={{
                textTransform: 'none',
                marginRight: 2,
              }}>
                <NavLink to={x.to} style={({isActive}) => ({
                  textDecoration: 'none',
                  // color: isActive ? "gray" : ""
                  // color: 'white'
                })}>{x.name}</NavLink>
              </Button>
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

function TokensButton() {
  const { currentAccount, onRightChain} = useContext(etherContext);
  const { balance, refreshToken } = useContext(useTokenContext);
  
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{display: 'inline'}}>
      <Button 
      variant='text' 
      color='success' 
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      onClick={() => {
        requestTokens().then(() => {
          refreshToken && refreshToken();
        })
      }}
      disabled={!(currentAccount&&onRightChain)} 
      sx={{
      marginRight: 1,
      textTransform: 'none',
    }}>Tokens: {balance}</Button>
  
    <Popover
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      sx={{
        pointerEvents: 'none',
      }}
      onClose={handlePopoverClose}
      disableRestoreFocus
    >Request 10 Vlike Tokens</Popover>
    </Box>
  )
}