//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./RatingSystem.sol";
import "./VlikeToken.sol";

contract RatingFactory {
    Rating[] public ratingArray;
    mapping(address => address[]) public UserAddressToContractAddress;

    function createRatingSystemContract(
        string memory name,
        VlikeToken token,
        bool enableTokenAtInit,
        uint256 dice,
        address vrfCoordinator,
        address link,
        uint256 fee,
        bytes32 keyhash
    ) public returns(Rating tokenAddress){
        Rating rating = new Rating(
            name,
            token,
            enableTokenAtInit,
            dice,
            vrfCoordinator,
            link,
            fee,
            keyhash
        );
        ratingArray.push(rating);
        return new Rating(name, token, enableTokenAtInit, dice, vrfCoordinator, link, fee, keyhash);
    }
    function getContractCount(address) public view returns(uint256) {
        // needs to return the specific users contract count, I am unsure on the syntax.
        return(uint);
    }


    function getContract(address, uint256) public view returns (address) {
        // needs to return the contract address(es) that a specific user has created.
        return UserAddressToContractAddress;
    }
    
}