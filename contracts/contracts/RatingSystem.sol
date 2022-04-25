// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Rating {

    using SafeMath for uint256;
    
    uint256 public itemIdCounter = 1;

    struct Item {
        uint256 itemID; 
        // bytes32 urlData;
        string urlData;
        uint256 ratingsCount;
    }

    struct RatingByUser {
        bool hasVoted;
        bool rating;
    }

    // storage for Items by itemID
    mapping(uint256 => Item) itemMapping;

    // storage for scores for each itemID
    mapping(uint256 => bool[]) itemScores;

    // stores a bool for the rating and bool for whether or not the user
    // has voted. 
    mapping(address => mapping(uint256 => RatingByUser)) userRating;

    // mapping from url to item Id
    mapping(string => uint256) url_IDMapping;

    // consider only owner visibility. Do users register items that they want to rate
    // or do we provide the items? We only want an item to be registered once. 
    function registerItem(string memory _urlData) public returns(uint256 itemId) {
        require(url_IDMapping[_urlData] == 0, 'This item is already registered');
        Item memory item = Item(itemIdCounter, _urlData, 0);
        itemMapping[itemIdCounter] = item;
        url_IDMapping[_urlData] = itemIdCounter;
        itemIdCounter = itemIdCounter.add(1);
        return item.itemID;
    }


    function rate(uint256 _itemId, bool _score) public {
        require(userRating[msg.sender][_itemId].hasVoted == false, 'Cannot vote twice!');
        userRating[msg.sender][_itemId].hasVoted = true;
        userRating[msg.sender][_itemId].rating = _score;
        itemScores[_itemId].push(_score);
        itemMapping[_itemId].ratingsCount = itemMapping[_itemId].ratingsCount.add(1);
    }

    function getRatingCount(uint256 _itemId) public view returns (uint256 _count) {
        _count = itemMapping[_itemId].ratingsCount;
    }

    // With this function, do we plan on calling it as the admin or is 
    // this a function that the user will call to see their previous
    // scoring of content.
    function getRating(uint256 _itemId, address _user) public view returns(RatingByUser memory _rating) {
        _rating = userRating[_user][_itemId];
        // _rating = userRating[msg.sender][_itemId] 
        // use the commented out version if we want the user to call this function.
        return _rating;
    }
}