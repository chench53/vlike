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
  Tooltip,
  Typography,
  Paper
} from '@mui/material';
import Refresh from '@mui/icons-material/Refresh';
import HelpIcon from '@mui/icons-material/Help';

import { ItemDialog } from './item_dlg';
import { getItemsCount, getItem } from 'apis/ethereum';
import { ratingContractContext } from 'apis/hooks';

interface tableRow {
  id: number,
  value: string,
  like: number,
  dislike: number,
}

interface ItemsProps {
}

export default function Items(props: ItemsProps) {


  const { contractAddress } = useContext(ratingContractContext);

  const [ dataFetched, setDataFetched ] = useState(true);
  const [ open, setOpen ] = useState(false);
  const [ rows, setRows ] = useState<tableRow[]>([])
  const [ refreshKey, setRefreshKey ] = useState(0); // bad idea

  useEffect(() => {
    const handleGetRatingContract = async () => {
      setDataFetched(false);
      const count = await getItemsCount(contractAddress);
      // @ts-ignore
      const arr = [...Array(5).keys()].map(i => count-1-i).filter(i=>i>=0); // only last 5 items. 
      const rows = await Promise.all(arr.map(i => getRow(contractAddress, i)))
      setRows(rows);
      setDataFetched(true);
    }
    if (contractAddress && !open) {
      handleGetRatingContract();
    }
  }, [contractAddress, open, refreshKey])


  const getRow = async (contractAddress: string, i: number) => {
    const item = await getItem(contractAddress, i);
    // console.log(item)
    let row = {
      id: item.itemID,
      value: item.urlData,
      like: item.likeCount,
      dislike: item.dislikeCount,
    } as tableRow
    return row;
  }

  const handleDlgClose = (tx: string|null) => {
    setOpen(false);
  };

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
        >
          Items
          <Tooltip title='The table shows 5 recently added items' placement="top">
            <HelpIcon fontSize="small" sx={{marginLeft: 1}}/>
          </Tooltip>
        </Typography>
        <IconButton  disabled={!contractAddress} onClick={() => setRefreshKey(oldKey => oldKey +1)}>
          <Refresh></Refresh>
        </IconButton>
        <Button variant='contained' sx={{whiteSpace:'nowrap'}} 
          onClick={() => {setOpen(true)}}
        >Add Item</Button>
      </Toolbar>
      <ItemsTable dataFetched={dataFetched} rows={rows}></ItemsTable>
      <ItemDialog
        open={open}
        onClose={handleDlgClose}
      />
    </Box>
  )
}

interface TableProps {
  dataFetched: boolean,
  rows: tableRow[]
}

function ItemsTable(props: TableProps) {

  const { dataFetched, rows } = props;
  const { contractAddress } = useContext(ratingContractContext);

  function shortValue(value: string) {
    const parser = new DOMParser();
    var htmlDoc = parser.parseFromString(value, 'text/html');
    var tag = htmlDoc.body.firstElementChild?.nodeName;
    if (tag) {
      tag = `<${tag.toLowerCase()}>...`
    }
    return tag;
  }

  return (
    <TableContainer component={Paper}>
      { dataFetched ? '' : <LinearProgress sx={{ width: '100%'}}/> }
      <Table sx={{ minWidth: 'md' }} >
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 40 }}>id</TableCell>
            <TableCell style={{ }}>value</TableCell>
            <TableCell style={{ width: 80 }} align="right">like</TableCell>
            <TableCell style={{ width: 80 }} align="right">dislike</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              component={Link} to={`/dashboard/${contractAddress}/item/${row.id}`}
              sx={{ 
                textDecoration: 'none'
              }}
            >
              <TableCell>
                {row.id}
              </TableCell>
              <TableCell sx={{
              }}>
                {/* <Button> */}
                <Tooltip title={row.value}>
                  <Typography sx={{
                    width: 'calc(100%*0.20)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: "nowrap"
                  }}>
                    {shortValue(row.value)}

                  </Typography>
                </Tooltip>
                {/* </Button> */}
              </TableCell>
              <TableCell align="right">{row.like}</TableCell>
              <TableCell align="right">{row.dislike}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}