import { useState, useContext, MouseEvent } from "react";
import { Button, Box, Popover, Menu, MenuItem } from '@mui/material';

import { etherContext } from 'apis/use_wallet';
import { useTokenContext } from 'apis/hooks';
import { requestTokens } from 'apis/ethereum';


export default function TokensButton() {

    const { currentAccount, onRightChain } = useContext(etherContext);
    const { balance, refreshToken } = useContext(useTokenContext);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  
    const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
  
    return (
      <Box sx={{ display: 'inline' }}>
        <Button
          variant='text'
          color='success'
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handleClose}
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
          onClose={handleClose}
          disableRestoreFocus
        >Request 10 Vlike Tokens</Popover>

      </Box>
    )
  }