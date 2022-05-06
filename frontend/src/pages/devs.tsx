import { useState } from 'react';

import {
  Box,
  Container,
  Button,
  DialogTitle,
  Dialog,
  FormControl,
  FormControlLabel,
  Switch,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  TextField,
  Typography,
  Paper
} from '@mui/material';

import { createRating } from '../apis/ethereum';

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

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
      <SimpleDialog
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
                  row.tokenEnabled || <Button variant='contained' size='small'>Enable Token</Button>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Create New Contract</DialogTitle>
      <RatingForm handleSubmited={handleClose}></RatingForm>
    </Dialog>
  );
}

export interface RatingFormProps {
  handleSubmited: () => void;
}


export function RatingForm(props: RatingFormProps) {

  const { handleSubmited } = props;

  interface modeType {
    name: string;
    enableTokenAtInit: boolean;
  }

  const [model, setModel] = useState<modeType>({
    name: '',
    enableTokenAtInit: false,
  })

  const [msg, setMsg] = useState('');

  async function formSubmit() {
    createRating(model.name, model.enableTokenAtInit).then(x => {
      setMsg(`Transaction: ${x}`)
      handleSubmited();
    }, error => {
      console.error(error);
      handleSubmited();
    })
  }

  return (
    <Container maxWidth="sm" sx={{ marginBottom: 2}}>
      <Box>
        <FormControl sx={{ width: '40ch', gap: 2 }}>
          <TextField label="Name" variant="standard" onChange={(e) => {
            setModel(o => {
              o.name = e.target.value; return o
            })
          }} />
          <FormControlLabel
            control={
              <Checkbox name="enableTokenAtInit" 
                onChange={(e) => {
                  setModel(o => {
                    o.enableTokenAtInit = e.target.checked; return o
                  })
                }}
              />
            }
            label="enable tokens"
          />
        </FormControl>
        <Box sx={{ marginTop: 4 }}>
          <Button variant="contained" onClick={formSubmit}>Create Contract</Button>
        </Box>
        <Box>
          {msg ? msg : ""}
        </Box>
      </Box>
    </Container>
  );
}