import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import { useWallet } from '../apis/use_wallet';
import { getRatingCount, getUserRating, rate } from '../apis/ethereum';

const { ethereum } = window;

interface InfoProps {
  itemId: number
}

export default function Info(props: InfoProps) {
  const { itemId } = props;
  const [hasRated, setHasRated] = useState(false);
  const [ratingCount, setRatingCount] = useState([0, 0])
  const { currentAccount, setCurrentAccount } = useWallet();

  useEffect(() => {
    fetchCurrentRatingInfo()
  }, [currentAccount])
  
  function fetchCurrentRatingInfo() {    
    getRatingCount(itemId).then(data => {
      setRatingCount([data[0], data[1]])
    })
    getUserRating(itemId).then(data => {
      setHasRated(data[0]);
    })
  }

  function giveRating(score: number) {
    rate(itemId, score).then(() => {
      fetchCurrentRatingInfo()
    })
  }

  return (
    <Box sx={{
      display: 'flex',
      'justify-content': 'end'
    }}>
      <Box sx={{ 'margin-right': '12px' }}>
        <IconButton disabled={hasRated || !ethereum.selectedAddress} onClick={()=>giveRating(1)}>
          <ThumbUpIcon />
        </IconButton>
        {ratingCount[1]}
      </Box>
      <Box>
        <IconButton disabled={hasRated|| !ethereum.selectedAddress} onClick={()=>giveRating(0)}>
          <ThumbDownIcon />
        </IconButton>
        {ratingCount[0]}
      </Box>
    </Box>
  );
}