import { useState, useEffect, useContext } from 'react';
import {
  Card,
  CardContent,
  CardActions
} from '@mui/material';

import Player from 'components/player';
import Info from 'components/info';
import { etherContext } from 'apis/use_wallet';
import { getItem } from 'apis/ethereum';

interface ContentProps {
  id: number
}

export default function Content(props: ContentProps) {

  const { id } = props;
  const { currentAccount, currentChain } = useContext(etherContext);
  const [value, setValue] = useState('')

  useEffect(() => {
    getItem(process.env.REACT_APP_CONTRACT_RATING || '', id).then(item => {
      setValue(item.urlData);
    })
  }, [currentAccount, currentChain])

  return (
    <Card sx={{}}>
      <CardContent>
        <Player value={value} />
      </CardContent>
      <CardActions>
        <Info itemId={id} />
      </CardActions>
    </Card>
  )
}