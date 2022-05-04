import { useState } from "react";

export const useWallet = () => {
  const { ethereum } = window
  const [currentAccount, setCurrentAccount] = useState<string | undefined>(ethereum.selectedAddress);

  // @ts-ignore
  ethereum.on("accountsChanged", ([newAccount]) => {
    console.log("accountsChanged: ", newAccount);
    setCurrentAccount(newAccount);
  })

  return { currentAccount, setCurrentAccount };
}

export const connectWallet = async (handlerSetAccout: (account: string)=>void) => {
  const ethereum = window.ethereum;
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