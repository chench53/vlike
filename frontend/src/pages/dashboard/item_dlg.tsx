import { useEffect, useState, useContext } from 'react';

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  TextField,
} from '@mui/material';

import { addItem } from 'apis/ethereum';
import { ratingContractContext } from 'apis/hooks';

interface DialogProps {
  open: boolean;
  onClose: (tx: string | null) => void;
}

export function ItemDialog(props: DialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(null);
  };

  const handleSubmited = (tx: string | null) => {
    onClose(tx);
  };

  return (
    <Dialog disableEscapeKeyDown onClose={handleClose} open={open}>
      <DialogTitle>Add Item</DialogTitle>
      <ItemForm handleSubmited={handleSubmited}></ItemForm>
    </Dialog>
  );
}

interface ItemFormProps {
  handleSubmited: (tx: string | null) => void;
}

interface ModelType {
  value: string
}

function ItemForm(props: ItemFormProps) {

  const { handleSubmited } = props;

  const { contractAddress } = useContext(ratingContractContext);

  const [ valid, setValid ] = useState(false);
  const [ model, setModel ] = useState<ModelType>(getDefaultModel())

  useEffect(() => {
    if (model.value) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [model.value])

  function getDefaultModel() {
    return {
      value: '',
    } as ModelType
  } 

  function clear() {
    setModel(model => {
      return {...model, ...getDefaultModel()}
    })
  }

  async function submit() {
    addItem(contractAddress, model.value).then(x => {
      handleSubmited(x);
    }, error => {
      console.error(error);
      handleSubmited(null);
    })
  }

  return (
    <Container sx={{padding: 2}}>
      <FormControl sx={{ width: '60ch', gap: 2 }}>
        <TextField 
          required
          label="value" 
          value={model.value}
          helperText="Only support <iframe/> element in this form"
          multiline 
          rows={4}
          onChange={(e) => {
            console.log('ppp')
            setModel(
              model => {
                return {...model, ...{value: e.target.value}}
              }
            )
          }}
        />
      </FormControl>
      <Box sx={{ 
        marginTop: 4,
        textAlign: 'end'
      }}>
        <Button variant="contained" color="secondary" onClick={clear} sx={{marginRight:2}}>clear</Button>
        <Button variant="contained" disabled={!valid} onClick={submit}>submit</Button>
      </Box>
    </Container>
  )
}
