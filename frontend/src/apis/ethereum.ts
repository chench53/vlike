import { AbiItem } from "web3-utils";

import helperConfig from "./helper-config.json";
import etherConfig from "./ether-config.json";
import abi_rating from './abi/rating.json';
import abi_rating_factory from './abi/rating_factory.json';
import abi_vlike_token from './abi/vlike_token.json';
import abi_pools from './abi/pools.json';

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
const contractPoolsAddress = process.env.REACT_APP_CONTRACT_VLIKE_TOKEN
const contractPools = new web3.eth.Contract(abi_pools as AbiItem[], contractPoolsAddress);

export const getEtherConfig = async () => {
  const chainId: string = await web3.eth.getChainId();
  const networkName =  helperConfig[chainId]
  
  const vrfCoordinator = etherConfig['networks'][networkName]['vrf_coordinator']
  const linkToken = etherConfig['networks'][networkName]['link_token']
  const keyhash = etherConfig['networks'][networkName]['keyhash']

  return {
    vrfCoordinator,
    linkToken,
    keyhash
  }
}

export const setTag = async (name: string) => {
  return await contractVlikeToke.methods.setTag(name).send({from: ethereum.selectedAddress});
}

export const getRatingCount = async (itemId: number) => {
  return await contractRating.methods.getRatingCount(itemId).call()
}

export const getUserRating = async (itemId: number) => {
  return await contractRating.methods.getUserRating(itemId).call({from: ethereum.selectedAddress});
}

export const getRatingContractCount = async (user: string) => {
  return await contractRatingFactory.methods.getContractCount(user).call();
}

export const getRatingContract = async (user: string, index: number) => {
  // try{
    return await contractRatingFactory.methods.getContract(user, index).call();
  // } catch(e) {
  //   console.error(e);
  // }
}

export const getRatingContractBaseInfo = async (address: string) => {
  const MyContractRating = new web3.eth.Contract(abi_rating as AbiItem[], address);
  const _baseInfo = await MyContractRating.methods.getBaseInfo().call();
  return {
    name: _baseInfo[0],
    tokenEnabled: _baseInfo[1]
  }
}

export const rate = async (itemId: number, rating: number) => {
  // const txParams = {
  //   to: contractRatingAddress,
  //   from: ethereum.selectedAddress,
  //   data: contractRating.methods.rate(itemId, !!rating).encodeABI()
  // }
  // return await ethereum.request({
  //   method: 'eth_sendTransaction',
  //   params: [txParams]
  // })

  return await contractRating.methods.rate(itemId, !!rating).send({from: ethereum.selectedAddress})
}

export const createRating = async (name: string, enableTokenAtInit: boolean) => {
  const { vrfCoordinator, linkToken, keyhash } = await getEtherConfig();
  console.log(ethereum.selectedAddress)
  // const txParams = {
  //   to: contractRatingFactoryAddress,
  //   from: ethereum.selectedAddress,
  //   data: contractRatingFactory.methods.createRatingSystemContract(
  //     name,
  //     contractPoolsAddress,
  //     enableTokenAtInit, 
  //     100, 
  //     vrfCoordinator, 
  //     linkToken,
  //     1000000, // bignumber issue
  //     keyhash
  //     ).encodeABI()
  // }
  // const tx = await ethereum.request({
  //   method: 'eth_sendTransaction',
  //   params: [txParams]
  // })
  // return tx;
  return await contractRatingFactory.methods.createRatingSystemContract(
      name,
      contractPoolsAddress,
      enableTokenAtInit, 
      100, 
      vrfCoordinator, 
      linkToken,
      1000000, // bignumber issue
      keyhash
  ).send({from: ethereum.selectedAddress})
  // .on("confirmation", (confirmationNumber: number, receipt: object) => {
  //   console.log(receipt)
  // })

  // return await setTag(name);
}

