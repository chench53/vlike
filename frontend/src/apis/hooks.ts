import { createContext } from 'react';

interface ratingContractType {
  contractAddress: string
}

export const ratingContractContext = createContext<ratingContractType>({
  contractAddress: '',
});