import { createContext } from 'react';

interface contractType {
  contractAddress: string
}

export const ratingContractContext = createContext<contractType>({
  contractAddress: '',
});

interface useTokenType {
  balance: number,
  refreshToken?: () => void, 
}

export const useTokenContext = createContext<useTokenType>({
  balance: 0,
});
