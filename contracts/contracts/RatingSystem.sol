// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Rating {

    using SafeMath for uint256;
    
    uint256 itemIdCounter = 1;

    struct Item {
        uint256 itemID; 
        bytes32 urlData;
        bool[] ratings;
        uint256 ratingsCount = 0;
    }

    // storage for ratings by itemID
    mapping(uint256 => Item) itemMapping;

    // stores a mapping from user address -> itemId -> user rating for itemId
    mapping(address => mapping(uint256 => bool)) userRating;

    // stores a bool that is true if a user has voted for a particular
    // itemID and false otherwise.
    mapping(address => mapping(uint256 => bool)) userHasVoted;

    // mapping from url to item Id
    mapping(bytes32 => uint256) url_IDMapping;

    // consider only owner visibility. Do users register items that they want to rate
    // or do we provide the items? We only want an item to be registered once. 
    function registerItem(bytes32 _urlData) returns(uint256 itemId) {
        require(itemMapping[urlData] == false, 'This item is already registered');
        itemMapping[itemIdCounter] = Item(itemIdCounter, _urlData);
        url_IDMapping[_urlData] = itemIdCounter;
        itemIdCounter = itemIdCounter.add(1);
    }


    function rate(uint256 _itemId, bool _score) public external {
        require(userHasVoted[msg.sender][itemId] == false, 'Cannot vote twice!');
        userHasVoted[msg.sender][itemId] = true;
        itemMapping[_itemId].ratings.push(_score);
        ratingsCount = ratingsCount.add(1);
    }

    function getRatingCount(uint256 _itemId) returns (uint256 _count) {
        _count = itemMapping[_itemId].ratingsCount;
    }

    // With this function, do we plan on calling it as the admin or is 
    // this a function that the user will call to see their previous
    // scoring of content.
    function getRating(uint 256 _itemId, address _user) external returns(bool _rating) {
        _rating = userRating[msg.sender][_itemId];
    }

}// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Rating {

    using SafeMath for uint256;
    
    uint256 itemIdCounter = 1;

    struct Item {
        uint256 itemID; 
        bytes32 urlData;
        bool[] ratings;
        uint256 ratingsCount = 0;
    }

    // storage for ratings by itemID
    mapping(uint256 => Item) itemMapping;

    // stores a mapping from user address -> itemId -> user rating for itemId
    mapping(address => mapping(uint256 => bool)) userRating;

    // stores a bool that is true if a user has voted for a particular
    // itemID and false otherwise.
    mapping(address => mapping(uint256 => bool)) userHasVoted;

    // mapping from url to item Id
    mapping(bytes32 => uint256) url_IDMapping;

    // consider only owner visibility. Do users register items that they want to rate
    // or do we provide the items? We only want an item to be registered once. 
    function registerItem(bytes32 _urlData) returns(uint256 itemId) {
        require(itemMapping[urlData] == false, 'This item is already registered');
        itemMapping[itemIdCounter] = Item(itemIdCounter, _urlData);
        url_IDMapping[_urlData] = itemIdCounter;
        itemIdCounter = itemIdCounter.add(1);
    }


    function rate(uint256 _itemId, bool _score) public external {
        require(userHasVoted[msg.sender][itemId] == false, 'Cannot vote twice!');
        userHasVoted[msg.sender][itemId] = true;
        itemMapping[_itemId].ratings.push(_score);
        ratingsCount = ratingsCount.add(1);
    }

    function getRatingCount(uint256 _itemId) returns (uint256 _count) {
        _count = itemMapping[_itemId].ratingsCount;
    }

    // With this function, do we plan on calling it as the admin or is 
    // this a function that the user will call to see their previous
    // scoring of content.
    function getRating(uint 256 _itemId, address _user) external returns(bool _rating) {
        _rating = userRating[msg.sender][_itemId];
    }

}// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Rating {

    using SafeMath for uint256;
    
    uint256 itemIdCounter = 1;

    struct Item {
        uint256 itemID; 
        bytes32 urlData;
        bool[] ratings;
        uint256 ratingsCount = 0;
    }

    // storage for ratings by itemID
    mapping(uint256 => Item) itemMapping;

    // stores a mapping from user address -> itemId -> user rating for itemId
    mapping(address => mapping(uint256 => bool)) userRating;

    // stores a bool that is true if a user has voted for a particular
    // itemID and false otherwise.
    mapping(address => mapping(uint256 => bool)) userHasVoted;

    // mapping from url to item Id
    mapping(bytes32 => uint256) url_IDMapping;

    // consider only owner visibility. Do users register items that they want to rate
    // or do we provide the items? We only want an item to be registered once. 
    function registerItem(bytes32 _urlData) returns(uint256 itemId) {
        require(itemMapping[urlData] == false, 'This item is already registered');
        itemMapping[itemIdCounter] = Item(itemIdCounter, _urlData);
        url_IDMapping[_urlData] = itemIdCounter;
        itemIdCounter = itemIdCounter.add(1);
    }


    function rate(uint256 _itemId, bool _score) public external {
        require(userHasVoted[msg.sender][itemId] == false, 'Cannot vote twice!');
        userHasVoted[msg.sender][itemId] = true;
        itemMapping[_itemId].ratings.push(_score);
        ratingsCount = ratingsCount.add(1);
    }

    function getRatingCount(uint256 _itemId) returns (uint256 _count) {
        _count = itemMapping[_itemId].ratingsCount;
    }

    // With this function, do we plan on calling it as the admin or is 
    // this a function that the user will call to see their previous
    // scoring of content.
    function getRating(uint 256 _itemId, address _user) external returns(bool _rating) {
        _rating = userRating[msg.sender][_itemId];
    }

}
