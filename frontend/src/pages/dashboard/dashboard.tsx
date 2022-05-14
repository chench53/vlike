import { useState, useEffect, useContext } from 'react';
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

export default function Dashboard() {

  let { contractAddress } = useParams();

  return (
    <Box sx={{marginTop: 4}}>
      {/* <NavMenu></NavMenu> */}
      <Container maxWidth="md">
        <Box sx={{marginBottom: 4}}>
          address: {contractAddress}
        </Box>
        {
          contractAddress?<Items contractAddress={'0xe0aA552A10d7EC8760Fc6c246D391E698a82dDf9'}/>:''
        }
      </Container>
    </Box>
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