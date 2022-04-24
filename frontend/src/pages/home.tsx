import { Grid, Container } from '@mui/material';

import Player from '../components/player';
import Info from '../components/info';

export default function Home() {

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} justifyContent="center" direction="column">
        <Grid item >
          <Player />
        </Grid>
        <Grid item >
          <Info />
        </Grid>
      </Grid>
    </Container>
  );
}