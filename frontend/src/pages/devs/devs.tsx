import { useState, useEffect } from 'react';

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Paper
} from '@mui/material';

import { ContractDialog } from './create_contract';
import { getRatingContract } from "../../apis/ethereum";

export default function Devs() {

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    // setSelectedValue(value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{
      margin: '0 20%'
    }}>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 }
        }}
      >
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          My Contracts
        </Typography>
        <Button variant='contained' onClick={handleClickOpen}>New</Button>
      </Toolbar>
      <RatingsTable></RatingsTable>
      <ContractDialog
        open={open}
        onClose={handleClose}
      />
    </Box>
  )
}

export function RatingsTable() {

  function createData(
    address: string,
    name: string,
    tokenEnabled: boolean,
    balance: number,
  ) {
    return { address, name, tokenEnabled, balance };
  }

  const rows = [
    createData('0x6951b5Bd815043E3F842c1b026b0Fa888Cc2DD85', 'test', false, 0),
    createData('0xe0aA552A10d7EC8760Fc6c246D391E698a82dDf9', 'test1', true, 0.2),
  ];

  useEffect(() => {
    console.log('useEffect');
    try {
      getRatingContract(0)
    } catch(e) {
      
    }
    // try {
    //   getRatingContract(0).then(rating => {
    //     console.log(rating);
    //   }, error => {
    //     console.error(error);
    //   })
    // } catch(e) {
    //   console.error(e);
    // }
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Token enabled</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.address}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.address}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.tokenEnabled.toString()}</TableCell>
              <TableCell align="right">{row.balance}</TableCell>
              <TableCell align="right">
                {
                  row.tokenEnabled ? undefined : (
                    <Button variant='contained' size='small'>Enable Token</Button>
                    )
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}