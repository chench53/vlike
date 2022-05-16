import { Box  } from '@mui/material';

// import { connectWallet, useWallet } from '../apis/use_wallet';

interface PlayerProps { 
  embedUrl: string
}

export default function Player(props: PlayerProps) {

  const { embedUrl } = props;

  return (
    <Box sx={{display: 'flex', 'justify-content': 'center'}}>
      <iframe 
        width="560" 
        height="315"
        src={ embedUrl }
        title="YouTube video player"  
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
      </iframe>
    </Box>
  );
}