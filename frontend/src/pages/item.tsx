import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
} from '@mui/material';

import Content from 'components/content';

export default function Item() {

  let { address, id } = useParams();
  address = address || ''
  let _id: number = 0
  if (id) {
    _id = parseInt(id)
  }
  return (
    <Container maxWidth="md" sx={{
      marginTop: 2
    }}>
      {
        (address && id) && (
          <Box>
            <Box sx={{ marginBottom: 4 }}>
              Address: {address} <br />
              Id: {_id}
            </Box>
            <Grid container justifyContent="center" alignItems="center" gap={8} sx={{
              marginTop: 4
            }}>
              <Content address={address} id={_id} />
            </Grid>
          </Box>
        )
      }
    </Container>
  );
}