import { Skeleton } from '@mui/material';

interface PlayerProps {
  value: string
}

export default function Player(props: PlayerProps) {

  const { value } = props;

  if (value) {
    return (
      <div dangerouslySetInnerHTML={{ __html: value }}/>
    )
  }
  else {
    return (
      (<Skeleton variant="rectangular" width={210} height={118} />)
    )
  }
}