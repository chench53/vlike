// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./VlikeToken.sol";

contract Rating is VRFConsumerBase {

    uint256 public itemIdCounter = 1;
    VlikeToken public token;
    string public name;
    bool public tokenEnabled;

    // lottery end
    uint256 public dice;
    // chainlink
    uint256 public fee;
    bytes32 public keyhash;

    struct BaseInfo {
        string name;
        bool tokenEnabled;
    }

    struct StakeInfo {
        uint256 itemId;
        address rater;
        uint256 stakeAmount;
        uint256 voteWeight;
        uint256 votes;
    }
    // may not need?
    struct Pool {
        uint256 totalValue;
        // StakeInfo[] stakeInfos;
    }

    struct Item {
        uint256 itemID; 
        // bytes32 urlData;
        string urlData;
        uint256 likeCount;
        uint256 dislikeCount;
        uint256 totalRatingCount;
    }

    struct RatingByUser {
        bool hasVoted;
        bool rating;
    }

    // storage for Items by itemID
    mapping(uint256 => Item) public itemMapping;

    mapping(uint256 => mapping(bool => StakeInfo[])) public itemPoolMapping;
    // requestId => StakeInfo
    mapping(bytes32 => StakeInfo) public randomRequestMapping;

    // storage for scores for each itemID
    // mapping(uint256 => bool[]) itemScores;

    // stores a bool for the rating and bool for whether or not the user
    // has voted. 
    mapping(address => mapping(uint256 => RatingByUser)) public userRating;

    // mapping from url to item Id
    mapping(string => uint256) url_IDMapping;

    event rateEvent(
        uint256 itemId,
        address rater,
        bool rating
    );

    event stakeEvent(
        uint256 itemId,
        address rater,
        bytes32 requestId
    );

    event voteEvent(
        uint256 itemId,
        address voter,
        uint256 votedIndex
    );

    event rewardEvent(
        uint256 itemId,
        address winner,
        uint256 rewardAmount
    );

    constructor(
        string memory _name,
        VlikeToken _token,
        bool enableTokenAtInit,
        uint256 _dice,
        address _vrfCoordinator, 
        address _link,
        uint256 _fee,
        bytes32 _keyhash
    ) VRFConsumerBase(_vrfCoordinator, _link) {
        name = _name;
        dice = _dice;
        token = _token;
        fee = _fee;
        keyhash = _keyhash;
        if (enableTokenAtInit == true) {
            enableToken();
        }
    }

    function enableToken() public {
        tokenEnabled = true;
    }

    function getBaseInfo() external view returns (BaseInfo memory baseInfo) {
        return BaseInfo(name, tokenEnabled);
    }

    // consider only owner visibility. Do users register items that they want to rate
    // or do we provide the items? We only want an item to be registered once. 
    function registerItem(string memory _urlData) public returns(uint256) {
        require(url_IDMapping[_urlData] == 0, 'This item is already registered');
        Item memory item = Item(
            itemIdCounter, 
            _urlData, 
            0, 
            0, 
            0
        );
        itemMapping[itemIdCounter] = item;
        url_IDMapping[_urlData] = itemIdCounter;
        itemIdCounter += 1;
        return url_IDMapping[_urlData];
    }

    function rate(uint256 _itemId, bool _score) public returns(bool success){
        require(userRating[msg.sender][_itemId].hasVoted == false, 'Cannot vote twice!');

        if (tokenEnabled == true) {
            stake(_itemId, _score);
        }

        userRating[msg.sender][_itemId].hasVoted = true;
        userRating[msg.sender][_itemId].rating = _score;
        // itemScores[_itemId].push(_score);
        itemMapping[_itemId].totalRatingCount += 1;
        if (_score == true) {
            itemMapping[_itemId].likeCount += 1;
        }
        else {
            itemMapping[_itemId].dislikeCount += 1;
        }   

        emit rateEvent(_itemId, msg.sender, _score);

        success = true;
    }

    function stake(uint256 _itemId, bool _score) internal {
        (uint256 stakeAmount, uint256 voteWeight) = calculateRatingStake(_itemId);
        token.transferFrom(msg.sender, address(this), stakeAmount);
        StakeInfo memory stakeInfo = StakeInfo(_itemId, msg.sender, stakeAmount, voteWeight, 0);
        itemPoolMapping[_itemId][_score].push(stakeInfo);
        bytes32 requestId = requestRandomness(keyhash, fee);
        randomRequestMapping[requestId] = stakeInfo;

        emit stakeEvent(_itemId, msg.sender, requestId);
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

    function calculateRatingStake(uint256 _itemId) public view returns (uint256 stakeAmount, uint256 voteWeight) {
        uint256 index = itemMapping[_itemId].totalRatingCount + 1;
        return (_ether(1)/index, index);
    }

    // ether to wei
    function _ether(uint256 amountInEther) internal pure returns (uint256 amountInWei) {
        return amountInEther * 10 **18;
    }
    // for debug
    function debug(uint256 index) public pure returns (uint256) {
        return _ether(1)/index;
    }

    function fulfillRandomness(bytes32 _requestId, uint256 _randomness) internal override {
        require(_randomness > 0, "random not found");
        StakeInfo memory stakeInfo = randomRequestMapping[_requestId];
        vote(stakeInfo, _randomness);
        if (checkDice(_randomness)) {
            uint256 itemId = stakeInfo.itemId;
            reward(itemId, _randomness);
            resetPool(itemId);
        }
    }

    function checkDice(uint256 _randomness) internal view returns (bool) {
        bool checked = _randomness % dice == 0;
        return checked;
    }

    function vote(StakeInfo memory stakeInfo, uint256 _randomness) internal {
        bool rating = userRating[stakeInfo.rater][stakeInfo.itemId].rating;
        uint256 selectedIndex = _randomness % itemPoolMapping[stakeInfo.itemId][rating].length;
        itemPoolMapping[stakeInfo.itemId][rating][selectedIndex].votes += stakeInfo.voteWeight;

        emit voteEvent(stakeInfo.itemId, stakeInfo.rater, selectedIndex);
    }

    function reward(uint256 _itemid, uint256 _randomness) internal {
        uint256 rewardAmount;
        uint256 totalVotes;
        for (uint256 i=0; i<itemPoolMapping[_itemid][false].length; i++) {
            rewardAmount += itemPoolMapping[_itemid][false][i].stakeAmount;
            totalVotes += itemPoolMapping[_itemid][false][i].votes;
        }
        for (uint256 i=0; i<itemPoolMapping[_itemid][true].length; i++) {
            rewardAmount += itemPoolMapping[_itemid][true][i].stakeAmount;
            totalVotes += itemPoolMapping[_itemid][false][i].votes;
        }

        uint256 cursor = _randomness % totalVotes; 
        address winner = _findWinner(_itemid, cursor);
        token.transfer(winner, rewardAmount);

        emit rewardEvent(_itemid, winner, rewardAmount);
    }

    function _findWinner(uint256 _itemid, uint256 cursor) internal view returns (address winner) {
        uint256 accumVotes;
        for (uint256 i=0; i<itemPoolMapping[_itemid][false].length; i++) {
            accumVotes += itemPoolMapping[_itemid][false][i].votes;
            if (accumVotes > cursor) {
                return itemPoolMapping[_itemid][false][i].rater;
            }
        }
        for (uint256 i=0; i<itemPoolMapping[_itemid][true].length; i++) {
            accumVotes += itemPoolMapping[_itemid][true][i].votes;
            if (accumVotes > cursor) {
                return itemPoolMapping[_itemid][true][i].rater;
            }
        }
    }

    function resetPool(uint256 _itemid) internal {
        delete itemPoolMapping[_itemid][false];
        delete itemPoolMapping[_itemid][true];
    }
}