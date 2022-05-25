import { Box, Container } from '@mui/material';

export default function Faq() {

  const faq = [
    {
      q: 'What is Vlike?',
      a: 'Vlike is a decentralized rating system which can be integrated into other web3 dapps as a feature.'
    },
    {
      q: 'How can I integrate Vlike rating as a developer?',
      a: 'You can use RatingFactory contract to deploy your own rating contract. Register items on the rating contract, and accept viewers\' rating data',
    },
    {
      q: 'What does it cost for a user to rate an item?',
      a: 'If the rating contract deesn\'t enable token, the user only need to pay the gas fee. If the rating contract enable token, the user need to pay extra Vlike tokens, and the rating contract need some Link tokens to call Chainlink vrf'
    },
    {
      q: 'What is Vlike token?',
      a: 'Vlike token is an ERC20 token which is designed to reward viewers for giving good feedback.'
    },
    {
      q: 'What does "good feedback" mean?',
      a: 'The way we define "good feedback": feedback on certain content is considered good if this feedback is consistent with future long-term ratings of this content. So better feedback should be earlier than other ratings and predict future feedback.'
    },
    {
      q: "Where can I find more detail about this project?",
      a: "Please refer to our gitbook: https://chench53.gitbook.io/hackathon/"
    }
  ]

  return (
    <Container className='faqbox' maxWidth="md">
      <Box><h1>Frequently Asked Questions</h1>
        {
          faq.map(x => {
            return (
              <Box sx={{marginBottom: 4}}>
                <h3><li>{x.q}</li></h3>
                <p>{x.a}</p>
              </Box>
            )
          })
        }
      </Box>
    </Container>
  );
}