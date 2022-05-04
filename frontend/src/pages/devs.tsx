import {
  Box,
  Container,
  Button,
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch,
  TextField
} from '@mui/material';

export default function Devs() {

  function createContract() {
    // console.log('ppppp');
    
  }

  return (
    <Container maxWidth="sm">
      <Box>
        <FormControl sx={{ width: '40ch' }}>
          <FormGroup sx={{gap: 2}}>
            <TextField id="standard-basic" label="Name" variant="outlined" />
            <FormControlLabel
              control={
                <Switch name="enableTokenAtInit" />
              }
              label="enable tokens"
            />
          </FormGroup>
        </FormControl>
        <Box sx={{marginTop: 4}}>
          <Button variant="contained" onClick={createContract}>Create Contract</Button>
        </Box>
      </Box>
    </Container>
  );
}