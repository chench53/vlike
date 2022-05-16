import { 
  Box, 
  Container,
  Grid, 
  Divider, 
  Typography 
} from '@mui/material';

import Content from 'components/content';

export default function Demo() {

  return (
    <Container sx={{
      marginTop: 2
    }}>
      <Typography variant="h6">
        Address: {process.env.REACT_APP_CONTRACT_RATING}, Token not enabled.
      </Typography>
      <Grid container justifyContent="center" alignItems="center" gap={8} sx={{
        marginTop: 4
      }}>
        <Content id={0} />
        <Content id={1} />
      </Grid>
    </Container>
  );
}