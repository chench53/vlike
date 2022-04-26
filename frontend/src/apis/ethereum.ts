import Web3 from 'web3';
import { AbiItem } from "web3-utils";

import abi_rating from './abi/rating.json';

const { ethereum } = window;
const rpcURL: string | undefined = process.env.REACT_APP_API_URL;
const web3 = new Web3(rpcURL!!);
const contractRatingAddress = process.env.REACT_APP_CONTRACT_RATING
const contractRating = new web3.eth.Contract(abi_rating as AbiItem[], contractRatingAddress);

export const getRatingCount = async (itemId: number) => {
  return await contractRating.methods.getRatingCount(itemId).call()
}

export const getUserRating = async (itemId: number) => {
  return await contractRating.methods.getUserRating(itemId).call({from: ethereum.selectedAddress})
}

export const rate = async (itemId: number, rating: number) => {
  console.log(ethereum.selectedAddress);
  const txParams = {
    to: contractRatingAddress,
    from: ethereum.selectedAddress,
    data: contractRating.methods.rate(itemId, !!rating).encodeABI()
  }
  return await ethereum.request({
    method: 'eth_sendTransaction',
    params: [txParams]
  })
}
