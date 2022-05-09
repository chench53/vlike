# Vlike: A decentralized rating system

*We like, or we dislike. We don't hide.*

---

Vlike is the proof of concept of a decentralized rating system.
Please check this [gitbook](https://chench53.gitbook.io/hackathon/) for more details.

## Project structure

```
| README.md
|-contracts
  | README.md
  |-contracts
  |-interfaces
  |-scipts
  |...
|-frontend
  | README.md
  |-src
  | ...
```

- contracts: 
    - brownie
- frontend:
    - react
    - web.js

## Development

To start developing locally, please:

1. Open the Brownie console. It launches a ganache process locally on localhost:8545. In /contracts, run

    `brownie console`

2. Deployed contracts on local testnet. In the brownie console, run

    `run('scripts/deploy')`

     It would write a `.env.development.local` file in /frontend with the addresses of contracts.

3. Run frontend in the development mode. In /frontend: 

    `npm start`

    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

4. Connect wallet to local:8545, import a ganache generated test account with 100 ether.

Then you can interact with local contracts in this local web page.


## Deployment

To deploy this project:

1. Deployed Rating contact on rinkeby testnet. In /contracts: 

    `brownie run .\scripts\deploy.py  --network rinkeby`

    get the Rating contract address on rinkeby.
  
2. Create .env.local file in /frontend:

    ```
    REACT_APP_API_URL=REACT_APP_API_URL=/chain
    REACT_APP_CONTRACT_RATING={the Rating contract address}
    ... 
    ```

    Since .env.local has higher priority than .env, the better practice is to assign a separate deployment server with different .env.local.

3. Build frontend to the /frontend folder:

    `npm run build`

4. On a server, use nginx or apache to serve files in /frontend/build, add this proxy rule:

    ```
    location /chain {
        proxy_pass https://rinkeby.infura.io/v3/bbf6b774ab29429d98322d03c268f5e8;
    }
    ```

## Demo

The addresses of the contracts currently deployed on the testnet:

- Rating [0x9f5518A4A5958Ac5a202e8Ca9488517250001753](https://rinkeby.etherscan.io/address/0x9f5518A4A5958Ac5a202e8Ca9488517250001753)
- Token 0xCAadB6ED550E18800AC309A8c1Fb1362877a4Bf5
- RatingFactory 0x825B3e6948ca38a3905c0691567FFbC0cb865017

The web page deployed 

- [Vlike](http://vlike.frontiech.com/)
