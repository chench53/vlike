import { useState, useEffect, useContext } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import { etherContext } from 'apis/use_wallet';
import { getRatingCount, getUserRating, rate } from 'apis/ethereum';

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
  address: string,
  itemId: number
}

export default function Info(props: InfoProps) {
  const { address, itemId } = props;
  const [hasRated, setHasRated] = useState(false);
  const [myRating, setMyRating] = useState<number | undefined>(undefined);
  const [ratingCount, setRatingCount] = useState([0, 0])
  const { currentAccount, currentChain } = useContext(etherContext);

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
  }, [currentAccount, currentChain])
  
  function fetchCurrentRatingInfo() {
    getRatingCount(address, itemId).then(data => {
      setRatingCount([data[0], data[1]])
    })
    getUserRating(address, itemId).then(data => {
      setHasRated(data[0]);
      // console.log(data)
      if (data[0] === true) {
        setMyRating(+data[1]);
        console.log('setMyRating')
      }
    })
  }

  function giveRating(score: number) {
    rate(address, itemId, score).then(() => {
      fetchCurrentRatingInfo()
    })
  }

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 2,
      paddingRight: 2,
    }}>
      <Typography variant='subtitle1'>
      id: {itemId}
      </Typography>
      <Box sx={{display: 'flex', gap: 2}}>
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
    </Box>
  );
}