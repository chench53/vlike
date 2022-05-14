import { useEffect, useState, createContext, useContext  } from "react";

import helperConfig from "./helper-config.json";
// import etherConfig from "./ether-config.json";

const { ethereum } = window;

export interface ethConnectionType {
  currentAccount: string | undefined;
  setCurrentAccount?: (arg0: string) => void;
  currentChain: string | undefined;
  SetCurrentChain?: (arg0: string) => void;
  onRightChain: boolean | undefined;
}

export const etherContext = createContext<ethConnectionType>({
  currentAccount: undefined,
  currentChain: undefined,
  onRightChain: undefined,
});

export const useWallet = () => {
  const [currentAccount, setCurrentAccount] = useState<string | undefined>(ethereum.selectedAddress);
  const [currentChain, SetCurrentChain] = useState<string | undefined>(undefined);
  const [onRightChain, SetOnRightChain] = useState<boolean | undefined>(undefined);

  console.log('render useWallet')
  useEffect(() => {
    // @ts-ignore
    ethereum.on("accountsChanged", ([newAccount]) => {
      console.log("accountsChanged: ", newAccount);
      setCurrentAccount(newAccount);
    })
    // @ts-ignore
    ethereum.on('chainChanged', (chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      window.location.reload();
    });

     ethereum.request({ method: 'net_version' }).then((chainId: string) => {
      console.log(`connect chainId: ${chainId}, chainName: ${helperConfig[chainId]}`)
      SetCurrentChain(helperConfig[chainId]);
      if (helperConfig[chainId]) {
        SetOnRightChain(helperConfig[chainId] === process.env.REACT_APP_CHAIN_NETWORK)
      } else if (chainId) {
        SetOnRightChain(false);
      } else {
        SetOnRightChain(undefined);
      }
    });
  }, [])

  return { 
    currentAccount, 
    setCurrentAccount, 
    currentChain, 
    SetCurrentChain,
    onRightChain
  } as ethConnectionType;
}

export const connectWallet = async (handlerSetAccout: ((account: string)=>void) | undefined) => {
  if (!ethereum) {
    console.log("No wallet plugin is available!");
    return;
  }

  try {
    const [account] = await ethereum.request({ method: 'eth_requestAccounts' });
    console.log(`account connect: ${account}`)
    if (handlerSetAccout) {
      handlerSetAccout(account);
    }
  } catch (err) {
    console.log(err);
  }
}

export const getCurrentChain = async () => {
  const chainId = ethereum.request({ method: 'eth_chainId' });
  return helperConfig[chainId];
}