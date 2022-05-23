import { useState, useEffect, useContext } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import { etherContext } from 'apis/use_wallet';
import { useTokenContext, msgContext } from 'apis/hooks';
import { getRatingCount, getUserRating, rate } from 'apis/ethereum';

const { ethereum } = window;

interface RatingOptionProps {
  address: string,
  hasRated: boolean,
  myRating: number | undefined,
  giveRating: (arg0: number) => void,
  ratingOptionValue: number,
  ratingCount: number,
  icon: any,
}

function RatingOption(props: RatingOptionProps) {
  const { address, hasRated, myRating, giveRating, ratingOptionValue, ratingCount, icon } = props;
  const Icon = icon;
  return (
    <Box>
      <IconButton disabled={hasRated || !ethereum.selectedAddress || !address} onClick={() => giveRating(ratingOptionValue)}>
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
  const [ hasRated, setHasRated ] = useState(false);
  const [ myRating, setMyRating ] = useState<number | undefined>(undefined);
  const [ ratingCount, setRatingCount ] = useState([0, 0])
  const { currentAccount, currentChain } = useContext(etherContext);
  const { refreshToken } = useContext(useTokenContext);
  const { show, text, open } = useContext(msgContext)

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
    if (address) {
      fetchCurrentRatingInfo()
    }
  }, [currentAccount, currentChain, address])
  
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
    refreshToken && refreshToken();
  }

  function giveRating(score: number) {
    rate(address, itemId, score).then(() => {
      fetchCurrentRatingInfo()
    }, e => {
      console.error(e)
      if (e==='TokensInsufficient') {
        show('Insufficient vlike tokens', 'error')
      } else if (e==="LinkTokensInsufficient")
        show("The contract doesn't have enough link tokens ", "error")
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
                address={address}
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