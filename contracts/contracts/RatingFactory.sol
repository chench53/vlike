//SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "./RatingSystem.sol";

contract RatingFactory is RatingSystem {

    RatingSystem[] public ratingSystemArray;

    function createRatingSystemContract() public {
        RatingSystem ratingSystem = new RatingSystem();
        RatingSystemArray.push(ratingSystem);
    }
}