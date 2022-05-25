import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';

import Items from './items';
import { ratingContractContext } from 'apis/hooks';
import { 
  ContractBaseInfo, 
  getDefalutContractBaseInfo,
  getRatingContractBaseInfo, 
  ratingEnableToken,
  toEther
} from 'apis/ethereum';
import { etherContext } from 'apis/use_wallet';
import { msgContext } from 'apis/hooks';

export default function Dashboard() {

  const { contractAddress } = useParams();
  const { currentAccount } = useContext(etherContext);
  const { show } = useContext(msgContext);
  const [ baseInfo, setBaseInfo ] = useState<ContractBaseInfo>(getDefalutContractBaseInfo())
  const [ enableLoading,  setEnableLoading] = useState(false);

  useEffect(() => {
    if (contractAddress && currentAccount) {
      getRatingContractBaseInfo(contractAddress||'').then(data => {
        if (data.owner !== currentAccount) {
          console.error(data.owner, currentAccount)
          show("You are not the owner of this contract. ", "error")
        }
        setBaseInfo(data);
      })
    }
  }, [contractAddress, currentAccount])

  function enableToken() {
    if(contractAddress) {
      setEnableLoading(true);
      ratingEnableToken(contractAddress).then(() => {
        setEnableLoading(false);
        getRatingContractBaseInfo(contractAddress||'').then(data => {
          setBaseInfo(data);
        })
      }, e => {
        setEnableLoading(false);
      })
    }
  }

  return (
    <ratingContractContext.Provider value={{contractAddress: contractAddress || ''}}>
      <Box sx={{marginTop: 2}}>
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
              Vlike token balance: {toEther(baseInfo.balance.toString())} <br/>
              Link token balance: {toEther(baseInfo.linkTokenBanlance.toString())} <br/>
            </Typography>
            {
              (contractAddress && !baseInfo.tokenEnabled && baseInfo.owner)?(
                <Button 
                  variant="contained" 
                  color="warning" 
                  disabled={(baseInfo.owner !== currentAccount) || enableLoading}
                  endIcon={enableLoading?<CircularProgress size={20}/>:''}
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