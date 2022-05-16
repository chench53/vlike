import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  TextField,
} from '@mui/material';

import { createRating } from 'apis/ethereum';

interface DialogProps {
  open: boolean;
  onClose: (tx: string|null) => void;
}

export function ContractDialog(props: DialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(null);
  };

  const handleSubmited = (tx: string|null) => {
    onClose(tx);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Create New Contract</DialogTitle>
      <RatingForm handleSubmited={handleSubmited}></RatingForm>
    </Dialog>
  );
}

interface RatingFormProps {
  handleSubmited: (tx: string|null) => void;
}

function RatingForm(props: RatingFormProps) {

  const { handleSubmited } = props;
  
  interface modeType {
    name: string;
    enableTokenAtInit: boolean;
  }
  
  const [ valid, setValid ] = useState(false);
  const [ model, setModel ] = useState<modeType>({
    name: '',
    enableTokenAtInit: false,
  })

  useEffect(() => {
    console.log('model.name')
    if (model.name) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [model.name])

  async function formSubmit() {
    createRating(model.name, model.enableTokenAtInit).then(x => {
      handleSubmited(x);
    }, error => {
      console.error(error);
      handleSubmited(null);
    })
  }

  return (
    <Container maxWidth="sm" sx={{ marginBottom: 2 }}>
      <Box>
        <FormControl sx={{ width: '40ch', gap: 2 }}>
          <TextField label="Name" variant="standard" onChange={(e) => {
            setModel(Object.assign(model, {name: e.target.value}))
            setValid(true);
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
          <Button variant="contained" disabled={!valid} onClick={formSubmit}>Create Contract</Button>
        </Box>
      </Box>
    </Container>
  );
}