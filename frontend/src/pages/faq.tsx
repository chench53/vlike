import { Box, Container } from '@mui/material';

export default function Faq() {

  return (
    <Container className='faqbox' maxWidth="sm">
      <Box><h1>Frequently Asked Questions</h1>
        <li>
          <h3>Why should I pay to rate content?</h3>
          <p>
            By requiring a small fee to rate videos we incentivize users to be honest,
            because if a user rates content maliciously or without good intent, they will lose their staked tokens.
          </p>
          <h3>What do users get out of honestly rating with Vlike?</h3>
          <p>Users have a verifiably random chance of being rewarded in Vlike tokens, if the tokens are enabled.</p>
          <h3>Why Vlike?</h3>
          <p>Vlike allows users to view content with a decentralized
            rating that cannot be altered or removed due to the immutable property of blockchains.</p>



        </li>



      </Box>
    </Container>
  );
}