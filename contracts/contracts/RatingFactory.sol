//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./RatingSystem.sol";
import "./VlikeToken.sol";

contract RatingFactory {
    Rating[] public ratingArray;

    // VlikeToken public token;
    // bool public tokenEnabled;
    // bool public enableTokenAtInit;

    // function enableToken() public {
    //     tokenEnabled = true;
    // }

    function createRatingSystemContract(
        VlikeToken token,
        bool enableTokenAtInit,
        address vrfCoordinator, 
        address link,
        uint256 fee,
        bytes32 keyhash
    ) public {
        Rating rating = new Rating(token, enableTokenAtInit, vrfCoordinator, link, fee, keyhash);
        ratingArray.push(rating);
        // if (enableTokenAtInit == true) {
        //     enableToken();
        // }
    }
}
