import { AbiItem } from "web3-utils";

import helperConfig from "./helper-config.json";
import etherConfig from "./ether-config.json";
import abi_rating from './abi/rating.json';
import abi_rating_factory from './abi/rating_factory.json';
import abi_vlike_token from './abi/vlike_token.json';

const Web3 = require("web3");
// const BN = require('bn.js');

const { ethereum } = window;
// ethereum.enable();
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
const contractVlikeTokenAddress = process.env.REACT_APP_CONTRACT_VLIKE_TOKEN
const contractVlikeToke = new web3.eth.Contract(abi_vlike_token as AbiItem[], contractVlikeTokenAddress);

export const getRatingCount = async (itemId: number) => {
  return await contractRating.methods.getRatingCount(itemId).call()
}

export const getUserRating = async (itemId: number) => {
  return await contractRating.methods.getUserRating(itemId).call({from: ethereum.selectedAddress});
}

export const getRatingContract = async (index: Number) => {
  return await contractRatingFactory.methods.ratingArray(index).call();
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

  const chainId: string = await web3.eth.getChainId();
  const networkName =  helperConfig[chainId]

  const vrfCoordinator = etherConfig['networks'][networkName]['vrf_coordinator']
  const linkToken = etherConfig['networks'][networkName]['link_token']
  const keyhash = etherConfig['networks'][networkName]['keyhash']

  const txParams = {
    to: contractRatingFactoryAddress,
    from: ethereum.selectedAddress,
    data: contractRatingFactory.methods.createRatingSystemContract(
      contractVlikeTokenAddress,
      enableTokenAtInit, 
      100, 
      vrfCoordinator, 
      linkToken,
      1000000, // bignumber issue
      keyhash
      ).encodeABI()
  }
  return await ethereum.request({
    method: 'eth_sendTransaction',
    params: [txParams]
  })
}
