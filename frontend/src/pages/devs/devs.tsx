import { useState, useEffect } from 'react';

import {
  Box,
  Button,
  IconButton,
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
import Refresh from '@mui/icons-material/Refresh';

import { useWallet } from 'apis/use_wallet';
import { getRatingContract, getRatingContractBaseInfo } from "apis/ethereum";
import { ContractDialog } from './create_contract';

interface tableRow {
  address: string,
  name: string,
  tokenEnabled: boolean,
  balance: number,
}

export default function Devs() {

  const { currentAccount } = useWallet();  
  const [ rows, setRows ] = useState<tableRow[]>([])
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    // setSelectedValue(value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleGetRatingContract = async () => {
    if (currentAccount) {
      var r: tableRow[] = []
      for(let i=0; i<5; i++) {
        const row = await getRow(i);
        console.log(row);
        if (row) {
          r.push(row);
        } else {
          break;
        }
      }
      console.log(r);
      setRows(r);
    }
  }

  const getRow = async (i: number) => {
    const ratingContract = await getRatingContract(i);
    if (ratingContract) {
      const baseInfo = await getRatingContractBaseInfo(ratingContract);
      let row = {
        address: ratingContract,
        name: baseInfo.name,
        tokenEnabled: baseInfo.tokenEnabled,
        balance: 0,
      } as tableRow
      return row;
    }
  }

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
          <IconButton disabled={!currentAccount} onClick={handleGetRatingContract}>
            <Refresh></Refresh>
          </IconButton>
        </Typography>
        <Button variant='contained' disabled={!currentAccount} onClick={handleClickOpen}>New</Button>
      </Toolbar>
      <RatingsTable rows={rows}></RatingsTable>
      <ContractDialog
        open={open}
        onClose={handleClose}
      />
    </Box>
  )
}

interface RatingsTableProps {
  rows: tableRow[]
}

export function RatingsTable(props: RatingsTableProps) {

  const { rows } = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell >Name</TableCell>
            <TableCell >Token enabled</TableCell>
            <TableCell >Balance</TableCell>
            <TableCell >Actions</TableCell>
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
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.tokenEnabled.toString()}</TableCell>
              <TableCell align="right">{row.balance}</TableCell>
              <TableCell >
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