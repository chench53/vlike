//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./RatingSystem.sol";
import "./VlikeToken.sol";

contract RatingFactory {

    mapping(address => address[]) public UserAddressToContractAddress;

    event createRatingEvent(
        address user,
        address ratingContract
    );

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
        Rating ratingContract = new Rating(
            name,
            token,
            enableTokenAtInit,
            dice,
            vrfCoordinator,
            link,
            fee,
            keyhash
        );
        UserAddressToContractAddress[msg.sender].push(address(ratingContract));

        emit createRatingEvent(msg.sender, address(ratingContract));

        return ratingContract;
    }
    // return the specific users contract count.
    function getContractCount(address user) public view returns(uint256 count) {
        return UserAddressToContractAddress[user].length;
    }
    // return the contract address(es) that a specific user has created.
    function getContract(address user, uint256 index) public view returns (address) {
        uint256 length = getContractCount(user);
        require(index < getContractCount(user), 'index out of array length');
        return UserAddressToContractAddress[user][index];
    }
}