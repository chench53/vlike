import { Box  } from '@mui/material';

interface PlayerProps { }

export default function Player(props: PlayerProps) {
  const { } = props;

  return (
    <Box sx={{display: 'flex', 'justify-content': 'center'}}>
      <iframe 
        width="560" 
        height="315"
        src="https://www.youtube.com/embed/lRba55HTK0Q" 
        title="YouTube video player"  
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
      </iframe>
    </Box>
  );
}