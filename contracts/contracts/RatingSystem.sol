// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract Rating {

    // storage for ratings by itemId
    mapping(uint256 => uint8[]) ratings;

    // stores a mapping from user address -> itemId -> user rating for itemId
    mapping(address => mapping(uint256 => uint8)) userRating;

    // functions needed
    function registerItem(string memory data) returns(uint256 itemId) {

    }

    function rate(uint 256 itemId, uint8 score) {

    }

    function getRatingCount(uint256 itemId, uint8[] scores) returns (uint256[] scoreCount) {

    }

    function getRating(uint 256 _itemId, address _user) external returns(uint8 _rating) {
        _rating = userRating[msg.sender][_itemId];
    }

}