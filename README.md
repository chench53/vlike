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

1. Use ganache-cli to start the local testnet on localhost:8545

    `ganache-cli.cmd --accounts 10 --hardfork istanbul --gasLimit 12000000 --mnemonic brownie --port 8545`

    ganache will generat 10 test accounts.

2. Deployed Rating contact on local testnet. In /contracts: 

    `brownie run .\scripts\deploy.py`

  get the Rating contract address on local testnet.

3. Created .env file in /frontend:

    ```
    REACT_APP_API_URL=http://localhost:8545
    REACT_APP_CONTRACT_RATING={the Rating contract address}
    ```

4. Run frontend in the development mode. In /frontend: 

    `npm start`

    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

5. Connect wallet to local:8545, import a ganache generated test account with 100 ether.

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

- Rating [0x5ad56a6640A1fcDAc82FFC6ACA9dC9bCAd9B5bF7](https://rinkeby.etherscan.io/address/0x5ad56a6640A1fcDAc82FFC6ACA9dC9bCAd9B5bF7)
- Token 

The web page deployed 

- [Vlike](http://vlike.frontiech.com/)
