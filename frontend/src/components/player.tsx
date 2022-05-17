import { } from '@mui/material';

interface PlayerProps { 
  value: string
}

export default function Player(props: PlayerProps) {

  const { value } = props;

  return (
    <div 
      dangerouslySetInnerHTML={{__html: value}} 
    >
    </div>
  );
}