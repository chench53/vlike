import { useParams } from "react-router-dom";

import { Box, Container } from '@mui/material';

export default function Dashboard() {

  let { address } = useParams();

  return (
    <Container maxWidth="sm">
      <Box>
        {address}
      </Box>
    </Container>
  );
}