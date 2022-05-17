import { 
  Container,
  Grid, 
  Typography 
} from '@mui/material';

import Content from 'components/content';

export default function Demo() {

  const address = process.env.REACT_APP_CONTRACT_RATING || ''

  return (
    <Container sx={{
      marginTop: 2
    }}>
      <Typography variant="h6">
        Address: {address}, Token not enabled.
      </Typography>
      <Grid container justifyContent="center" alignItems="center" gap={8} sx={{
        marginTop: 4
      }}>
        <Content address={address} id={0} />
        <Content address={address} id={1} />
      </Grid>
    </Container>
  );
}