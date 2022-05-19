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
  address: string
  id: number
}

export default function Content(props: ContentProps) {

  const { address, id } = props;
  const { currentAccount, currentChain } = useContext(etherContext);
  const [value, setValue] = useState('')

  useEffect(() => {
    if (address) {
      getItem(address, id).then(item => {
        setValue(item.urlData);
      })
    }
  }, [currentAccount, currentChain, address])

  return (
    <Card sx={{}}>
      <CardContent>
        <Player value={value} />
      </CardContent>
      <CardActions>
        <Info address={address} itemId={id} />
      </CardActions>
    </Card>
  )
}