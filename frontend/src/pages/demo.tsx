import { Grid, Container } from '@mui/material';

import Player from '../components/player';
import Info from '../components/info';

export default function Demo() {

  const item = {
    embedUrl: 'https://www.youtube.com/embed/lRba55HTK0Q',
    itemId: 0
  }

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} justifyContent="center" direction="column">
        <Grid item >
          <Player embedUrl={item.embedUrl}/>
        </Grid>
        <Grid item >
          <Info itemId={item.itemId}/>
        </Grid>
      </Grid>
    </Container>
  );
}