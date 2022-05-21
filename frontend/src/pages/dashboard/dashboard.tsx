import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';

import Items from './items';
import { ratingContractContext } from 'apis/hooks';
import { 
  ContractBaseInfo, 
  getDefalutContractBaseInfo,
  getRatingContractBaseInfo, 
  ratingEnableToken 
} from 'apis/ethereum';
import { etherContext } from 'apis/use_wallet';

export default function Dashboard() {

  const { contractAddress } = useParams();
  const { currentAccount } = useContext(etherContext);
  const [ baseInfo, setBaseInfo ] = useState<ContractBaseInfo>(getDefalutContractBaseInfo())

  useEffect(() => {
    if (contractAddress && currentAccount) {
      getRatingContractBaseInfo(contractAddress||'').then(data => {
        setBaseInfo(data);
      })
    }
  }, [contractAddress, currentAccount])

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
        {
          (baseInfo.owner && baseInfo.owner !== currentAccount) ? (
            <Alert severity="error" variant="filled" sx={{
                width: 'max-content', 
                position: 'absolute'
              }}>
                You are not the owner of this contract.
              </Alert>
          ) : ''
        }
        <Container maxWidth="md">
          <Box sx={{
            marginBottom: 2, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'baseline'
          }}>
            <Typography>
              address: {contractAddress} <br/>
              name: {baseInfo.name} <br/>
              token enabled: {baseInfo.tokenEnabled.toString()}<br/>
              balance: {baseInfo.balance} <br/>
              Link token banlance: {baseInfo.linkTokenBanlance} <br/>
            </Typography>
            {
              (contractAddress && !baseInfo.tokenEnabled && baseInfo.owner)?(
                <Button 
                  variant="contained" 
                  color="warning" 
                  disabled={baseInfo.owner !== currentAccount}
                  onClick={enableToken}
                >Enable Token</Button>
              ):''
            }
          </Box>
          {
            (contractAddress && baseInfo.owner === currentAccount)?<Items/>:''
          }
        </Container>
      </Box>
    </ratingContractContext.Provider>
  );
}