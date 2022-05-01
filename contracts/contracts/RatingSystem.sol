// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VlikeToken.sol";

contract Rating {

    uint256 public itemIdCounter = 1;
    VlikeToken public token;
    bool public tokenEnabled;

    struct Item {
        uint256 itemID; 
        // bytes32 urlData;
        string urlData;
        uint256 likeCount;
        uint256 dislikeCount;
        uint256 totalRatingCount;
        uint256 balance;
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

    event rateEvent(
        uint256 itemId,
        bool rating
    );

    constructor(
        VlikeToken _token,
        bool enableTokenAtInit
    ) {
        token = _token;
        if (enableTokenAtInit == true) {
            enableToken();
        }
    }

    function enableToken() public {
        tokenEnabled = true;
    }

    // consider only owner visibility. Do users register items that they want to rate
    // or do we provide the items? We only want an item to be registered once. 
    function registerItem(string memory _urlData) public returns(uint256) {
        require(url_IDMapping[_urlData] == 0, 'This item is already registered');
        Item memory item = Item(itemIdCounter, _urlData, 0, 0, 0, 0);
        itemMapping[itemIdCounter] = item;
        url_IDMapping[_urlData] = itemIdCounter;
        itemIdCounter += 1;
        return url_IDMapping[_urlData];
    }

    function rate(uint256 _itemId, bool _score) public returns(bool success){
        require(userRating[msg.sender][_itemId].hasVoted == false, 'Cannot vote twice!');
        userRating[msg.sender][_itemId].hasVoted = true;
        userRating[msg.sender][_itemId].rating = _score;
        itemScores[_itemId].push(_score);
        itemMapping[_itemId].totalRatingCount += 1;
        if (_score == true) {
            itemMapping[_itemId].likeCount += 1;
        }
        else {
            itemMapping[_itemId].dislikeCount += 1;
        }   

        if (tokenEnabled == true) {
            token.transfer(address(token), _calculateRatingStake(_itemId, _score));
        }   

        emit rateEvent(_itemId, _score);

        success = true;
    }

    function getRatingCount(uint256 _itemId) public view returns (uint256 dCount, uint256 lCount) {
        lCount = itemMapping[_itemId].likeCount;
        dCount = itemMapping[_itemId].dislikeCount;
        return (dCount, lCount);
    }

    function getUserRating(uint256 _itemId) public view returns(RatingByUser memory _rating) {
        _rating = userRating[msg.sender][_itemId];
        return _rating;
    }

    function adminGetUserRating(uint256 _itemId, address _user) public view returns(RatingByUser memory _rating){
        _rating = userRating[_user][_itemId];
    }

    function _calculateRatingStake(uint256 _itemId, bool _score) internal returns (uint256 stakeAmount) {
        return _ether(1);
    }
    // ether to wei
    function _ether(uint256 amountInEther) internal returns (uint256 amountInWei) {
        return amountInEther * 10 **18;
    }
}