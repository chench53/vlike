import { useState, useEffect, createContext, useContext } from 'react';
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  MenuList,
  MenuItem,
  Divider,
  ListItemText,
  Tabs,
  Tab,
} from '@mui/material';

import Items from './items';
import { ratingContractContext } from 'apis/hooks';


export default function Dashboard() {

  let { contractAddress } = useParams();

  return (
    <ratingContractContext.Provider value={{contractAddress: contractAddress || ''}}>
      <Box sx={{marginTop: 4}}>
        {/* <NavMenu></NavMenu> */}
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

// function NavMenu() {
//   return (
//     <Tabs
//       orientation="vertical"
//       sx={{ 'text-transform': 'none' }}
//     >
//       <Tab label="Contract" />
//       <Divider />
//       <Tab label="Items" />
//       <Tab label="Ratings" />
//       <Tab label="Rewards" />
//     </Tabs>
//   );
// }