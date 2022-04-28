import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import { useWallet } from '../apis/use_wallet';
import { getRatingCount, getUserRating, rate } from '../apis/ethereum';

const { ethereum } = window;

interface RatingOptionProps {
  hasRated: boolean,
  myRating: number | undefined,
  giveRating: (arg0: number) => void,
  ratingOptionValue: number,
  ratingCount: number,
  icon: any,
}

function RatingOption(props: RatingOptionProps) {
  const { hasRated, myRating, giveRating, ratingOptionValue, ratingCount, icon } = props;
  const Icon = icon;
  console.log(`${myRating}  ${ratingOptionValue}`)
  return (
    <Box>
      <IconButton disabled={hasRated || !ethereum.selectedAddress} onClick={() => giveRating(ratingOptionValue)}>
        <Icon color={myRating === ratingOptionValue ? 'primary' : undefined} />
      </IconButton>
      {ratingCount}
    </Box>
  )
}

interface InfoProps {
  itemId: number
}

export default function Info(props: InfoProps) {
  const { itemId } = props;
  const [hasRated, setHasRated] = useState(false);
  const [myRating, setMyRating] = useState<number | undefined>(undefined);
  const [ratingCount, setRatingCount] = useState([0, 0])
  const { currentAccount, setCurrentAccount } = useWallet();

  const ratingOptions = [
    {
      value: 1,
      icon: ThumbUpIcon,
    },
    {
      value: 0,
      icon: ThumbDownIcon,
    }
  ]

  useEffect(() => {
    fetchCurrentRatingInfo()
  }, [currentAccount])

  function fetchCurrentRatingInfo() {
    getRatingCount(itemId).then(data => {
      setRatingCount([data[0], data[1]])
    })
    getUserRating(itemId).then(data => {
      setHasRated(data[0]);
      console.log(data)
      if (data[0] === true) {
        setMyRating(+data[1]);
        console.log('setMyRating')
      }
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
      'justify-content': 'end',
      gap: 2
    }}>
      {
        ratingOptions.map(x => {
          return (
            <RatingOption
              key={x.value}
              hasRated={hasRated} 
              myRating={myRating} 
              giveRating={giveRating} 
              ratingOptionValue={x.value} 
              ratingCount={ratingCount[x.value]}
              icon={x.icon}
            ></RatingOption>
          )
        })
      }
    </Box>
  );
}