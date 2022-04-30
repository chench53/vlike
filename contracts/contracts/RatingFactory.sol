//SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "./RatingSystem.sol";

contract RatingFactory is Rating {

    Rating[] public ratingArray;

    function createRatingSystemContract() public {
        Rating rating = new Rating();
        ratingArray.push(rating);
    }
}