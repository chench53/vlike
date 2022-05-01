//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./RatingSystem.sol";
import "./VlikeToken.sol";

contract RatingFactory {
    Rating[] public ratingArray;
    VlikeToken public token;
    bool public tokenEnabled;
    bool public enableTokenAtInit;

    function enableToken() public {
        tokenEnabled = true;
    }

    function createRatingSystemContract() public {
        Rating rating = new Rating(token, enableTokenAtInit);
        ratingArray.push(rating);
        if (enableTokenAtInit == true) {
            enableToken();
        }
    }
}
