// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// pragma experimental ABIEncoderV2;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./VlikeToken.sol";
import "./Pools.sol";

contract Rating is VRFConsumerBase {

    uint256 public itemIdCounter;
    Pools public pools;
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

    // requestId => StakeInfo
    mapping(bytes32 => Pools.StakeInfo) public randomRequestMapping;

    // storage for scores for each itemID
    // mapping(uint256 => bool[]) itemScores;

    // stores a bool for the rating and bool for whether or not the user
    // has voted. 
    mapping(address => mapping(uint256 => RatingByUser)) public userRating;

    event registerEvent(
        uint256 itemId,
        string value
    );

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

    constructor(
        string memory _name,
        // VlikeToken _token,
        Pools _pools,
        bool enableTokenAtInit,
        uint256 _dice,
        address _vrfCoordinator, 
        address _link,
        uint256 _fee,
        bytes32 _keyhash
    ) VRFConsumerBase(_vrfCoordinator, _link) {
        name = _name;
        dice = _dice;
        pools = _pools;
        fee = _fee;
        keyhash = _keyhash;
        if (enableTokenAtInit == true) {
            enableToken();
        }
    }

    function enableToken() public {
        tokenEnabled = true;
        token = pools.token();
    }

    function getBaseInfo() external view returns (BaseInfo memory baseInfo) {
        return BaseInfo(name, tokenEnabled);
    }

    // consider only owner visibility. Do users register items that they want to rate
    // or do we provide the items? We only want an item to be registered once. 
    function registerItem(string memory _urlData) public returns(uint256) {
        Item memory item = Item(
            itemIdCounter, 
            _urlData, 
            0, 
            0, 
            0
        );
        itemMapping[itemIdCounter] = item;

        emit registerEvent(itemIdCounter, _urlData);

        itemIdCounter += 1;
        return itemIdCounter;
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
        token.transferFrom(msg.sender, address(pools), stakeAmount);

        Pools.StakeInfo memory stakeInfo = Pools.StakeInfo(_itemId, msg.sender, _score, stakeAmount, voteWeight, 0);
        pools.stake(_itemId, _score, stakeInfo);
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
        Pools.StakeInfo memory stakeInfo = randomRequestMapping[_requestId];
        pools.vote(stakeInfo, _randomness);
        if (checkDice(_randomness)) {
            uint256 itemId = stakeInfo.itemId;
            pools.reward(itemId, _randomness);
            // pools.resetPool(itemId);
        }
    }

    function checkDice(uint256 _randomness) internal view returns (bool) {
        bool checked = _randomness % dice == 0;
        return checked;
    }
}