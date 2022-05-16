import { useParams } from "react-router-dom";
import {
  Box,
  Container,
} from '@mui/material';

import Items from './items';
import { ratingContractContext } from 'apis/hooks';


export default function Dashboard() {

  let { contractAddress } = useParams();

  return (
    <ratingContractContext.Provider value={{contractAddress: contractAddress || ''}}>
      <Box sx={{marginTop: 4}}>
        <Container maxWidth="md">
          <Box sx={{marginBottom: 4}}>
            address: {contractAddress}
          </Box>
          {
            contractAddress?<Items/>:''
          }
        </Container>
      </Box>
    </ratingContractContext.Provider>
  );
}