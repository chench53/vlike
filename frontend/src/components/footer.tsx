import { Toolbar, IconButton, Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import CycloneIcon from '@mui/icons-material/Cyclone';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';

interface FooterProps { }

export default function Footer(props: FooterProps) {
    const { } = props;
    return (
        <> 
            <AppBar position="fixed" color="transparent" sx={{ borderTop: 1, borderColor: 'divider', top: 'auto', bottom: 0, maxHeight: 75}}>
                
                <Box sx={{ marginTop: 0, marginLeft: 3 }} >
                    <p>&copy; Vlike 2022</p>
                    <IconButton onClick={() => {
                        window.location.href = 'https://www.youtube.com/watch?v=lRba55HTK0Q&t=3s';
                    }} sx={{
                        marginLeft: 15, marginTop: -10, borderColor: 'divider',
                    }} >
                        <YouTubeIcon color="action" fontSize="large"/>  
                    </IconButton>
                    <IconButton onClick={() => {
                        window.location.href = 'https://chench53.gitbook.io/hackathon/';
                    }} sx={{
                        marginLeft: 2, marginTop: -10, borderColor: 'divider',
                    }} >
                        <CycloneIcon color="action" fontSize="large" />
                    </IconButton>
                    <IconButton onClick={() => {
                        window.location.href = 'https://github.com/chench53/vlike';
                    }} sx={{
                        marginLeft: 2, marginTop: -10, borderColor: 'divider',
                    }} >
                        <GitHubIcon color="action" fontSize="large" />
                    </IconButton>
                </Box>
                

                
                    
                        
                    
            </AppBar>
            
            <Toolbar
                component="nav"
                variant="dense"
                sx={{ overflowX: 'auto' }}
            >
            </Toolbar>
            
        </>

    );
}