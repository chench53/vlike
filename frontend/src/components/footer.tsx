import { IconButton, Box } from '@mui/material';
// import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ArticleIcon from '@mui/icons-material/Article';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';
// import logo from '../logo.svg';


interface BottomNavProps {
  name: string,
  icon: any,
  href: string,
}

function BottomNavBtn(props: BottomNavProps) {
  const Icon = props.icon;
  return (
    <IconButton target="_blank"  rel="noreferrer" href={props.href}>
      <Icon color="action" />
    </IconButton>
  )
}

interface FooterProps { }

export default function Footer(props: FooterProps) {
  const { } = props;

  const bottomNavBtnData = [
    {
      name: 'gitbook',
      icon: ArticleIcon,
      href: 'https://chench53.gitbook.io/hackathon/'
    },
    {
      name: 'youtube',
      icon: YouTubeIcon,
      href: 'https://youtu.be/_4TOf9y1J20'
    },
    {
      name: 'github',
      icon: GitHubIcon,
      href: 'https://github.com/chench53/vlike'
    },
  ]

  return (
      <Box position="relative" sx={{ height: 125, borderTop: 1, borderColor: 'divider', top: 'auto', bottom: 1}}>
        {/* <Box position='relative' sx={{ marginLeft: 15, bottom: -63, height: 57, width: 57 }}>
          <a target="_blank"  rel="noreferrer" href='https://chench53.gitbook.io/hackathon/'><img src={logo} alt=''/></a>
        </Box> */}
        <Box sx={{ marginLeft: 4, display: 'flex'}} >
          <p>&copy; Vlike 2022</p>
          <Box sx={{ display: 'flex', gap: 1, marginLeft: 6}}>
            {
              bottomNavBtnData.map(x => {
                return (
                  <BottomNavBtn key={x.name} name={x.name} icon={x.icon} href={x.href}></BottomNavBtn>
                )
              })
            }
          </Box>
        </Box>
        </Box>
  );
}