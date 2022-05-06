//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./RatingSystem.sol";
import "./VlikeToken.sol";

contract RatingFactory {
    Rating[] public ratingArray;

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
}
