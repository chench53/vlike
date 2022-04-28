import { AppBar, IconButton, Box } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';
import logo from '../logo.svg';


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
      icon: CurrencyExchangeIcon,
      href: 'https://chench53.gitbook.io/hackathon/tokenomics'
    },
    {
      name: 'github',
      icon: GitHubIcon,
      href: 'https://github.com/chench53/vlike'
    },
  ]

  return (
    <AppBar position="fixed" color="transparent" sx={{ borderTop: 1, borderColor: 'divider', top: 'auto', bottom: 0, }}>
      <Box position='fixed' sx={{ marginLeft: 15, marginTop: 3, bottom: -10, height: 57, width: 57 }}>
        <a href='https://chench53.gitbook.io/hackathon/'><img src={logo} /></a>
      </Box>
      <Box sx={{ marginLeft: 4, display: 'flex'}} >
        <p>&copy; Vlike 2022</p>
        <Box sx={{ display: 'flex', gap: 1, marginLeft: 6 }}>
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