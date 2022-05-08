import { useState } from 'react';

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@mui/material';

import { useWallet } from 'apis/use_wallet';
import { createRating } from 'apis/ethereum';

interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ContractDialog(props: SimpleDialogProps) {
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

interface RatingFormProps {
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
    <Container maxWidth="sm" sx={{ marginBottom: 2 }}>
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