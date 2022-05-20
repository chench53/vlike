import { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  IconButton,
  LinearProgress,
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

import { etherContext } from 'apis/use_wallet';
import { getRatingContractCount, getRatingContract, getRatingContractBaseInfo } from "apis/ethereum";
import { ContractDialog } from './create_contract';

interface tableRow {
  address: string,
  name: string,
  tokenEnabled: boolean,
  balance: number,
}

export default function Devs() {

  const { currentAccount, currentChain, onRightChain } = useContext(etherContext);
  const [ rows, setRows ] = useState<tableRow[]>([])
  const [ open, setOpen ] = useState(false);
  const [ dataFetched, setDataFetched ] = useState(true);

  useEffect(() => {
    if (currentAccount && onRightChain) {
      handleGetRatingContract();
    }
  }, [currentAccount, currentChain])

  const handleClose = (tx: string|null) => {
    setOpen(false);
    // setSelectedValue(value);
    if (tx) {
      handleGetRatingContract().then(() => {});
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleGetRatingContract = async () => {
    if (currentAccount) {
      setDataFetched(false);
      const count = await getRatingContractCount(currentAccount || '');
      // @ts-ignore
      const arr = [...Array(5).keys()].map(i => count-1-i).filter(i=>i>=0); // only last 5 rating. 
      const rows = await Promise.all(arr.map(i => getRow(i)))
      setRows(rows);
      setDataFetched(true);
    }
  }

  const getRow = async (i: number) => {
    const ratingContract = await getRatingContract(currentAccount || '', i); 
    const baseInfo = await getRatingContractBaseInfo(ratingContract);

    let row = {
      address: ratingContract,
      name: baseInfo.name,
      tokenEnabled: baseInfo.tokenEnabled,
      balance: 0,
    } as tableRow
    return row;
  }

  return (
    <Box className='devbox' sx={{
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
          My Rating Contracts
        </Typography>
          <IconButton disabled={!currentAccount} onClick={handleGetRatingContract}>
            <Refresh></Refresh>
          </IconButton>
        <Button variant='contained' disabled={!currentAccount} onClick={handleClickOpen}>New</Button>
      </Toolbar>
      <RatingsTable dataFetched={dataFetched} rows={rows}></RatingsTable>
      <ContractDialog
        open={open}
        onClose={handleClose}
      />
    </Box>
  )
}

interface RatingsTableProps {
  dataFetched: boolean,
  rows: tableRow[]
}

export function RatingsTable(props: RatingsTableProps) {

  const { dataFetched, rows } = props;

  return (
    <TableContainer component={Paper}>
      { dataFetched || <LinearProgress sx={{ width: '100%'}}/>}
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell >Name</TableCell>
            <TableCell >Token enabled</TableCell>
            <TableCell >Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.address}
              component={Link} to={`/dashboard/${row.address}/`}
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
                textDecoration: 'none'
              }}
            >
              <TableCell component="th" scope="row">
                {row.address}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.tokenEnabled.toString()}</TableCell>
              <TableCell align="right">{row.balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}