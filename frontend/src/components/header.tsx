import { Toolbar, Button, Box } from '@mui/material';

import { connectWallet, useWallet } from '../apis/use_wallet';

interface HeaderProps { }

export default function Header(props: HeaderProps) {
  const { } = props;
  const { currentAccount, setCurrentAccount } = useWallet();

  return (
    <Box>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        Demo for Vlike
        <Box sx={{ flex: 1 }} />
        {currentAccount ? (
          <Button variant='outlined'>
            {`${currentAccount.slice(0, 5)}...${currentAccount.slice(38)}`}
          </Button>
        ) : <Button variant='outlined' onClick={() => { connectWallet(setCurrentAccount) }} > connect </Button>
        }

      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
      </Toolbar>
    </Box>
  );
}