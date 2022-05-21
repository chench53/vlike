import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
} from '@mui/material';

import Items from './items';
import { ratingContractContext } from 'apis/hooks';
import { ContractBaseInfo, getRatingContractBaseInfo, ratingEnableToken } from 'apis/ethereum';

export default function Dashboard() {

  const { contractAddress } = useParams();
  const [ baseInfo, setBaseInfo ] = useState<ContractBaseInfo>({
    name: '',
    tokenEnabled: false,
    balance: 0,
    linkTokenBanlance: 0
  })

  useEffect(() => {
    if (contractAddress) {
      getRatingContractBaseInfo(contractAddress||'').then(data => {
        setBaseInfo(data);
      })
    }
  }, [contractAddress])

  function enableToken() {
    if(contractAddress) {
      ratingEnableToken(contractAddress).then(() => {
        getRatingContractBaseInfo(contractAddress||'').then(data => {
          setBaseInfo(data);
        })
      })
    }
  }

  return (
    <ratingContractContext.Provider value={{contractAddress: contractAddress || ''}}>
      <Box sx={{marginTop: 2}}>
        <Container maxWidth="md">
          <Box sx={{marginBottom: 2}}>
            address: {contractAddress} <br/>
            name: {baseInfo.name} <br/>
            token enabled: {baseInfo.tokenEnabled.toString()}<br/>
            balance: {baseInfo.balance} <br/>
            Link token banlance: {baseInfo.linkTokenBanlance} <br/>
            {
              (contractAddress && !baseInfo.tokenEnabled)?(
                <Button variant="contained" color="warning" onClick={enableToken} sx={{
                  marginTop: 2
                }}>Enable Token</Button>
              ):''
            }
          </Box>
          {
            contractAddress?<Items/>:''
          }
        </Container>
      </Box>
    </ratingContractContext.Provider>
  );
}