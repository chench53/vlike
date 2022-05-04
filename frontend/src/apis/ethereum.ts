import Web3 from 'web3';
import { AbiItem } from "web3-utils";

import abi_rating from './abi/rating.json';
import abi_rating_factory from './abi/rating_factory.json'

const { ethereum } = window;
const rpcURL: string | undefined = process.env.REACT_APP_API_URL;
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    rpcURL!!,
  )
);

const contractRatingAddress = process.env.REACT_APP_CONTRACT_RATING
const contractRating = new web3.eth.Contract(abi_rating as AbiItem[], contractRatingAddress);
const contractRatingFactoryAddress = process.env.REACT_APP_CONTRACT_RATING_FACTORY
const contractRatingFactory = new web3.eth.Contract(abi_rating_factory as AbiItem[], contractRatingFactoryAddress);

export const getRatingCount = async (itemId: number) => {
  return await contractRating.methods.getRatingCount(itemId).call()
}

export const getUserRating = async (itemId: number) => {
  return await contractRating.methods.getUserRating(itemId).call({from: ethereum.selectedAddress})
}

export const rate = async (itemId: number, rating: number) => {
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

export const createRating = async (name: string, enableTokenAtInit: boolean) => {
  const txParams = {
    to: contractRatingFactoryAddress,
    from: ethereum.selectedAddress,
    // data: contractRatingFactory.methods.createRatingSystemContract(itemId, !!rating).encodeABI()
  }
  return await ethereum.request({
    method: 'eth_sendTransaction',
    params: [txParams]
  })
}
