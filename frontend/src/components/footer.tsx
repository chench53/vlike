import { AppBar, IconButton, Box } from '@mui/material';
import CycloneIcon from '@mui/icons-material/Cyclone';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';


interface BottomNavProps {
  name: string,
  icon: any,
  href: string,
}

function BottomNavBtn(props: BottomNavProps) {
  const Icon = props.icon;
  return (
    <IconButton href={props.href}>
      <Icon color="action" />
    </IconButton>
  )
}

interface FooterProps { }

export default function Footer(props: FooterProps) {
  const { } = props;

  const bottomNavBtnData = [
    {
      name: 'youtube',
      icon: YouTubeIcon,
      href: 'https://www.youtube.com/watch?v=lRba55HTK0Q'
    },
    {
      name: 'gitbook',
      icon: CycloneIcon,
      href: 'https://chench53.gitbook.io/hackathon/'
    },
    {
      name: 'github',
      icon: GitHubIcon,
      href: 'https://github.com/chench53/vlike'
    },
  ]

  return (
    <AppBar position="fixed" color="transparent" sx={{ borderTop: 1, borderColor: 'divider', top: 'auto', bottom: 0, maxHeight: 75 }}>
      <Box sx={{ marginLeft: 4, display: 'flex'}} >
        <p>&copy; Vlike 2022</p>
        <Box sx={{ display: 'flex', gap: 1, marginLeft: 4 }}>
          {
            bottomNavBtnData.map(x => {
              return (
                <BottomNavBtn key={x.name} name={x.name} icon={x.icon} href={x.href}></BottomNavBtn>
              )
            })
          }
        </Box>
      </Box>
    </AppBar>
  );
}