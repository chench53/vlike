import { useEffect, useState, useContext } from 'react';

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  FormControl,
  TextField,
  Tooltip,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

import { addItem } from 'apis/ethereum';
import { ratingContractContext } from 'apis/hooks';

interface DialogProps {
  open: boolean;
  onClose: (tx: string | null) => void;
}

export function ItemDialog(props: DialogProps) {

  const { onClose, open } = props;
  const tip = `
This form allows the user to manually add item. For demonstration purposes, this form only support page-embedded elements, which you can find in the share options of the web apps.
For adding more general items please use the abi function which supports arbitrary string.
Refer to our documentation for more detail.
`

  const handleClose = () => {
    onClose(null);
  };

  const handleSubmited = (tx: string | null) => {
    onClose(tx);
  };

  return (
    <Dialog disableEscapeKeyDown onClose={handleClose} open={open}>
      <DialogTitle>
        Add Item
        <Tooltip title={tip} placement="bottom-start">
          <HelpIcon fontSize="small" sx={{verticalAlign: "revert", marginLeft: 1}}/>
        </Tooltip>
      </DialogTitle>
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
    if (model.value && checkValueValid(model.value)) {
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

  function checkValueValid(value: string) {
    return /^<\/?[a-z][\s\S]*>$/i.test(value);
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
          error={!valid}
          required
          label="</>" 
          value={model.value}
          helperText="Only support embedd element in this form"
          multiline 
          rows={4}
          onChange={(e) => {
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
