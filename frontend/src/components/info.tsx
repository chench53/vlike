import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import { useWallet } from '../apis/use_wallet';
import { getRatingCount } from '../apis/ethereum';

interface InfoProps { }

export default function Info(props: InfoProps) {
  const { } = props;
  const [userRated, setUserRated] = useState(false)
  const [ratingCount, setRatingCount] = useState([0, 0])
  const { currentAccount, setCurrentAccount } = useWallet();


  useEffect(() => {
    getRatingCount(1).then(data => {
      console.log(data);
      setRatingCount([data[0], data[1]])
    })
  }, [])

  function rate(score: number) {
    console.log(currentAccount)
    setUserRated(true);
  }

  return (
    <Box sx={{
      display: 'flex',
      'justify-content': 'end'
    }}>
      <Box sx={{ 'margin-right': '12px' }}>
        <IconButton disabled={userRated || !currentAccount} onClick={()=>rate(1)}>
          <ThumbUpIcon />
        </IconButton>
        {ratingCount[1]}
      </Box>
      <Box>
        <IconButton disabled={userRated || !currentAccount} onClick={()=>rate(0)}>
          <ThumbDownIcon />
        </IconButton>
        {ratingCount[0]}
      </Box>
    </Box>
  );
}