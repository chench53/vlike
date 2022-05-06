import { useState } from 'react';

import {
  Box,
  Container,
  Button,
  FormGroup,
  FormControl,
  InputLabel,
  Input,
  FormControlLabel,
  FormHelperText,
  Switch,
  TextField,
} from '@mui/material';

import { createRating } from '../apis/ethereum';

export default function Devs() {

  interface modeType {
    name: string;
    enableTokenAtInit: boolean;
  }

  const [model, setModel] = useState<modeType>({
    name: '',
    enableTokenAtInit: false,
  })

  const [msg, setMsg] = useState('');

  async function handleSubmit() {
    // console.log(model);
    createRating(model.name, model.enableTokenAtInit).then(x => {
      // console.log(x);
      setMsg(`Transaction: ${x}`)
    })
    // await createRating(model.name, model.enableTokenAtInit);
  }

  return (
    <Container maxWidth="sm">
      <Box>
        <FormControl sx={{ width: '40ch' }}>
          <TextField label="Name" variant="outlined" onChange={(e) => {
            setModel(o => {
              o.name = e.target.value; return o
            })
          }} />
          <FormControlLabel
            control={
              <Switch name="enableTokenAtInit"
                onChange={(e) => {
                  setModel(o => {
                    o.enableTokenAtInit = e.target.checked; return o
                  })
                }}
              />
            }
            label="enable tokens"
            labelPlacement="start"
          />
        </FormControl>
        <Box sx={{ marginTop: 4 }}>
          <Button variant="contained" onClick={handleSubmit}>Create Contract</Button>
        </Box>
        <Box>
          {msg?msg:""}
        </Box>
      </Box>
    </Container>
  );
}