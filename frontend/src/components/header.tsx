import { useState, useContext, useMemo, MouseEvent } from "react";
import { NavLink } from "react-router-dom";
import { Toolbar, Button, Box, Popover } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { connectWallet, etherContext } from 'apis/use_wallet';
import { useTokenContext } from 'apis/hooks';
import { requestTokens } from 'apis/ethereum';

interface HeaderProps { 
  handleSetTheme: (arg0: 'light' | 'dark') => void
}

export default function Header(props: HeaderProps) {

  const { handleSetTheme } = props;

  const { currentAccount, setCurrentAccount } = useContext(etherContext);

  // const NavTabs = [
  //   {
  //     name: 'Devs',
  //     to: '/devs',
  //   },
  //   {
  //     name: 'FAQ',
  //     to: '/faq',
  //   },
  // ]

  return (
    <Box>
      <Toolbar sx={{
        borderBottom: 1,
        borderColor: 'divider',
      }}>
        <NavLink className='lightmode' to="/" style={{ textDecoration: 'none' }}>
          Vlike
        </NavLink>

        

        <Box sx={{ flex: 1 }} />
          <div className="headerdiv">
          <input type="checkbox" className="checkbox" id="chk" onChange={e => {
            change(); change1(); change2(); change3()
              handleSetTheme(e.target.checked ? 'light':'dark')
            }}/>
            <label className="label" htmlFor="chk">
              <LightModeIcon className="licon" />
              <DarkModeIcon className="dicon" />
              <div className="ball"></div>
            </label>
          </div>

       
        <NavLink className="navexample" to="/example" style={{ padding: 7, textDecoration: 'none' }}>
          Examples
        </NavLink>
        <NavLink className="navdevs" to="/devs" style={{ padding: 7, textDecoration: 'none' }}>
          Devs
        </NavLink>
        <NavLink className="navfaq" to="/faq" style={{ padding: 7, textDecoration: 'none' }}>
          FAQ
        </NavLink>
        
        {/* {
          NavTabs.map(x => {
            return (
              <Button className='test1' key={x.name} sx={{
                textTransform: 'none',
                marginRight: 2,
              }}>
                <NavLink className='test1' to={x.to} style={() => ({
                  textDecoration: 'none',
                    // color: isActive ? "gray" : "",
                    // color: 'white'
                })}>{x.name}</NavLink>
              </Button>
            )
          })
          } */}
          

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

function change() {
  var get = document.querySelector('.lightmode');
  get?.classList.toggle("black")
}
document.querySelector(".checkbox")?.addEventListener("toggle", change);

function change1() {
  var get = document.querySelector('.navexample');
  get?.classList.toggle("testcss")
}
document.querySelector(".checkbox")?.addEventListener("toggle", change1);

function change2() {
  var get = document.querySelector('.navdevs');
  get?.classList.toggle("testcss")
}
document.querySelector(".checkbox")?.addEventListener("toggle", change2);

function change3() {
  var get = document.querySelector('.navfaq');
  get?.classList.toggle("testcss")
}
document.querySelector(".checkbox")?.addEventListener("toggle", change3);


function TokensButton() {
  const { currentAccount, onRightChain } = useContext(etherContext);
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
    <Box sx={{ display: 'inline' }}>
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
        disabled={!(currentAccount && onRightChain)}
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