import { useState, useEffect, useContext } from 'react';
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
import { getItemsCount, getItemRating } from 'apis/ethereum';

interface tableRow {
  id: number,
  value: string,
  like: number,
  dislike: number,
}

interface ItemsProps {
  contractAddress: string
}

export default function Items(props: ItemsProps) {

  const { contractAddress } = props;

  const [ dataFetched, setDataFetched ] = useState(true);
  const [ rows, setRows ] = useState<tableRow[]>([])

  useEffect(() => {
    if (contractAddress) {
      handleGetRatingContract();
    }
  }, [contractAddress])

  const handleGetRatingContract = async () => {

    setDataFetched(false);
    const count = await getItemsCount(contractAddress);
    // @ts-ignore
    const arr = [...Array(5).keys()].map(i => count-1-i).filter(i=>i>=0); // only last 5 items. 
    const rows = await Promise.all(arr.map(i => getRow(contractAddress, i)))
    setRows(rows);
    setDataFetched(true);
  }

  const getRow = async (contractAddress: string, i: number) => {
    const item = await getItemRating(contractAddress, i);
    console.log(item)
    let row = {
      id: item.itemID,
      value: item.urlData,
      like: item.likeCount,
      dislike: item.dislikeCount,
    } as tableRow
    return row;
  }

  return (
    <Box>
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
          Items
        </Typography>
          <IconButton>
            <Refresh></Refresh>
          </IconButton>
        <Button variant='contained' sx={{whiteSpace:'nowrap'}}>Add Item</Button>
      </Toolbar>
      <ItemsTable dataFetched={dataFetched} rows={rows}></ItemsTable>
    </Box>
  )
}

interface TableProps {
  dataFetched: boolean,
  rows: tableRow[]
}

function ItemsTable(props: TableProps) {

  const { dataFetched, rows } = props;

  return (
    <TableContainer component={Paper}>
      { dataFetched || <LinearProgress sx={{ width: '100%'}}/>}
      <Table sx={{ minWidth: 'md' }} >
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 40 }}>id</TableCell>
            <TableCell>value</TableCell>
            <TableCell style={{ width: 80 }} align="right">like</TableCell>
            <TableCell style={{ width: 80 }} align="right">dislike</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell>{row.value}</TableCell>
              <TableCell align="right">{row.like}</TableCell>
              <TableCell align="right">{row.dislike}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}