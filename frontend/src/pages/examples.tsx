import { useState, useEffect } from 'react';

import { 
  Box,
  Divider,
  Container,
  Grid, 
  Typography 
} from '@mui/material';

import Content from 'components/content';
import { getRatingContract } from 'apis/ethereum';

export default function Examples() {

  const admin_address = process.env.REACT_APP_ADMIN_ADDRESS || ''
  const  [ address0, setAddress0] = useState(''); // without token
  const  [ address1, setAddress1] = useState(''); /// with token

  useEffect(() => {
    getRatingContract(admin_address, 0).then(data => {
      setAddress0(data)
    })
    getRatingContract(admin_address, 1).then(data => {
      setAddress1(data)
    })
  }, [admin_address])

  return (
    <Container sx={{paddingBottom: 4}}>
      <ContractExample 
        address={address0} 
        itemsArray={[0, 1]}
        desc="Token not enabled"
      />
      <Divider/>
      <ContractExample 
        address={address1} 
        itemsArray={[0]}
        desc="Token enabled"
      />
    </Container>
  )
}

interface contractExampleProps {
  address: string,
  itemsArray: number[],
  desc: string,
}

function ContractExample(props: contractExampleProps) {

  const { address, itemsArray, desc } = props;

  return (
    <Box sx={{
      marginTop: 2,
      marginBottom: 4
    }}>
      <Typography>
        Address: {address}. {desc}
      </Typography>
      <Grid container alignItems="center" gap={16} sx={{
        marginTop: 4
      }}>
        {
          itemsArray.map(i => {
            return (<Content key={i} address={address} id={i} />)
          })
        }
      </Grid>
    </Box>
  );
}