import { AbiItem } from "web3-utils";

import helperConfig from "./helper-config.json";
import etherConfig from "./ether-config.json";
import abi_rating from './abi/rating.json';
import abi_rating_factory from './abi/rating_factory.json';
import abi_vlike_token from './abi/vlike_token.json';

const Web3 = require("web3");
// const BN = require('bn.js');

const { ethereum } = window;
const web3 = new Web3(window.ethereum);

const contractRatingFactoryAddress = process.env.REACT_APP_CONTRACT_RATING_FACTORY
const contractRatingFactory = new web3.eth.Contract(abi_rating_factory as AbiItem[], contractRatingFactoryAddress);
const contractVlikeTokenAddress = process.env.REACT_APP_CONTRACT_VLIKE_TOKEN
const contractVlikeToke = new web3.eth.Contract(abi_vlike_token as AbiItem[], contractVlikeTokenAddress);

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

export const getRatingCount = async (address: string, itemId: number) => {
  const MyContractRating = new web3.eth.Contract(abi_rating as AbiItem[], address);
  return await MyContractRating.methods.getRatingCount(itemId).call()
}

export const getUserRating = async (address: string, itemId: number) => {
  const MyContractRating = new web3.eth.Contract(abi_rating as AbiItem[], address);
  return await MyContractRating.methods.getUserRating(itemId).call({from: ethereum.selectedAddress});
}

export const getRatingContractCount = async (user: string) => {
  return await contractRatingFactory.methods.getContractCount(user).call();
}

export const getRatingContract = async (user: string, index: number) => {
  return await contractRatingFactory.methods.getContract(user, index).call();
}

export const getRatingContractBaseInfo = async (address: string) => {
  const MyContractRating = new web3.eth.Contract(abi_rating as AbiItem[], address);
  const _baseInfo = await MyContractRating.methods.getBaseInfo().call();
  return {
    name: _baseInfo[0],
    tokenEnabled: _baseInfo[1]
  }
}

export const rate = async (ratingContractAddress: string, itemId: number, rating: number) => {
  const MyContractRating = new web3.eth.Contract(abi_rating as AbiItem[], ratingContractAddress);
  const tokenEnabled = await MyContractRating.methods.tokenEnabled().call()
  if (tokenEnabled) {
    await contractVlikeToke.methods.approve(ratingContractAddress, Web3.utils.toWei('100', 'ether')).send({from: ethereum.selectedAddress})
  }
  return await MyContractRating.methods.rate(itemId, !!rating).send({from: ethereum.selectedAddress})
}

export const createRating = async (name: string, enableTokenAtInit: boolean) => {
  const { vrfCoordinator, linkToken, keyhash } = await getEtherConfig();
  // console.log(ethereum.selectedAddress)
  return await contractRatingFactory.methods.createRatingSystemContract(
      name,
      contractVlikeTokenAddress,
      enableTokenAtInit, 
      100, 
      vrfCoordinator, 
      linkToken,
      1000000, // bignumber issue
      keyhash
  ).send({from: ethereum.selectedAddress})
}

export const addItem = async (ratingContractAddress: string, value: string) => {
  const MyContractRating = new web3.eth.Contract(abi_rating as AbiItem[], ratingContractAddress);
  return await MyContractRating.methods.registerItem(value).send({from: ethereum.selectedAddress})
}

export const getItemsCount = async (ratingContractAddress: string) => {
  const MyContractRating = new web3.eth.Contract(abi_rating as AbiItem[], ratingContractAddress);
  return await MyContractRating.methods.itemIdCounter().call();
}
export const getItem = async (ratingContractAddress: string, itemId: number) => {
  const MyContractRating = new web3.eth.Contract(abi_rating as AbiItem[], ratingContractAddress);
  return await MyContractRating.methods.itemMapping(itemId).call({from: ethereum.selectedAddress});
}

export const getTokenBalance = async () => {
  return await contractVlikeToke.methods.balanceOf(ethereum.selectedAddress).call();
}

export const requestTokens = async () => {
  return await contractVlikeToke.methods.requestTokens().send({from: ethereum.selectedAddress});
}