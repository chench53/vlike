import { useEffect, useState, createContext, useContext  } from "react";

import helperConfig from "./helper-config.json";
import etherConfig from "./ether-config.json";

const { ethereum } = window;

const etherContext = createContext(null);

export const useWallet = () => {
  const [currentAccount, setCurrentAccount] = useState<string | undefined>(ethereum.selectedAddress);
  const [currentChain, SetCurrentChain] = useState<string | undefined>(undefined);

  
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
      console.log(helperConfig[chainId]);
      SetCurrentChain(helperConfig[chainId]);
    });
  }, [])

  return { 
    currentAccount, 
    setCurrentAccount, 
    currentChain, 
    SetCurrentChain 
  };
}

export const connectWallet = async (handlerSetAccout: (account: string)=>void) => {
  if (!ethereum) {
    console.log("No wallet plugin is available!");
    return;
  }

  try {
    const [account] = await ethereum.request({ method: 'eth_requestAccounts' });
    console.log(`account connect: ${account}`)
    handlerSetAccout(account);
  } catch (err) {
    console.log(err);
  }
}

export const getCurrentChain = async () => {
  const chainId = ethereum.request({ method: 'eth_chainId' });
  return helperConfig[chainId];
}