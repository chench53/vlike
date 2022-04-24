import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import { useWallet } from '../apis/use_wallet';

interface InfoProps { }

export default function Info(props: InfoProps) {
  const { } = props;
  const [rating, setRating] = useState({
    likeCount: 0, dislikeCount: 0
  })
  const [userRated, setUserRated] = useState(false)
  const { currentAccount, setCurrentAccount } = useWallet();

  function rate(score: number) {
    console.log(currentAccount)
    if (score === 255) {
      setRating({
        likeCount: rating.likeCount + 1, dislikeCount: 0
      })
    } else if (score === 0) {
      setRating({
        likeCount: 0, dislikeCount: rating.dislikeCount + 1
      })
    }
    setUserRated(true);
  }

  return (
    <Box sx={{
      display: 'flex',
      'justify-content': 'end'
    }}>
      <Box sx={{ 'margin-right': '12px' }}>
        <IconButton disabled={userRated || !currentAccount} onClick={()=>rate(255)}>
          <ThumbUpIcon />
        </IconButton>
        {rating.likeCount}
      </Box>
      <Box>
        <IconButton disabled={userRated || !currentAccount} onClick={()=>rate(0)}>
          <ThumbDownIcon />
        </IconButton>
        {rating.dislikeCount}
      </Box>
    </Box>
  );
}