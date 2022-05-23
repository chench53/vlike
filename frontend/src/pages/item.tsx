import { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Container,
  Grid,
  Typography
} from '@mui/material';

import Content from 'components/content';
import { getItem } from 'apis/ethereum';

interface itemInfoType {
  address: string,
  id: number
}

export default function Item() {
  
  let { address, id } = useParams();
  const { palette } = useTheme()
  const [ itemInfo, setItemInfo ] = useState<itemInfoType>({address: '', id: 0})
  const [ value, setValue] = useState('')

  useEffect(() => {
    if (address && id) {
      const _address =  address || '';
      let _id: number = 0
      if (id) {
        _id = parseInt(id)
      }
      setItemInfo(o=>{
        return {...o, ...{
          address: _address,
          id: _id
        }}
      })
      getItem(_address, _id).then(data => {
        console.log(data);
        if (data && data.urlData) {
          setValue(data.urlData);
        }
      })
    }
  }, [address, id])

  return (
    <Container maxWidth="md" sx={{
      marginTop: 2
    }}>
      {
        (address && id) && (
          <Box>
            <Typography>
              address: &nbsp; 
                <Link className={palette.mode}  to={`/dashboard/${itemInfo.address}`}>
                  {itemInfo.address} 
                </Link>
              <br />
              id: {id}
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: 4 }}>value: {value}</Typography>
            <Grid container justifyContent="center" alignItems="center" gap={8} sx={{
              marginTop: 4
            }}>
              <Content address={itemInfo.address} id={itemInfo.id} />
            </Grid>
          </Box>
        )
      }
    </Container>
  );
}