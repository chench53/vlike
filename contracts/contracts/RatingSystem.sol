// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./VlikeToken.sol";
import "./Pools.sol";

contract Rating is VRFConsumerBase {

    uint256 public itemIdCounter;
    Pools public pools;
    VlikeToken public token;
    string public name;
    bool public tokenEnabled;
    address public owner;

    // lottery
    uint256 public dice;
    uint256 public feeRatio;
    // chainlink
    LinkTokenInterface public linkToken;
    uint256 public linkFee = 100000000000000000;
    bytes32 public keyhash;

    struct BaseInfo {
        string name;
        bool tokenEnabled;
        uint256 balance;
        uint256 linkTokenBanlance;
        address owner;
    }

    struct Item {
        uint256 itemID;
        string urlData;
        uint256 likeCount;
        uint256 dislikeCount;
        uint256 totalRatingCount;
    }

    struct RatingByUser {
        bool hasRated;
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
        VlikeToken _token,
        bool enableTokenAtInit,
        uint256 _dice,
        uint256 _feeRatio,
        address _vrfCoordinator, 
        address _link,
        bytes32 _keyhash,
        address _owner        
    ) VRFConsumerBase(_vrfCoordinator, _link) {
        require(bytes(_name).length > 0, 'name can not be empty');
        require(_dice > 1, 'dice shall larger than 1');
        require(0<=_feeRatio && _feeRatio<=100, 'feeRatio shall be between 1 and 100');
        name = _name;
        dice = _dice;
        feeRatio = _feeRatio;
        token = _token;
        linkToken = LinkTokenInterface(_link);
        keyhash = _keyhash;
        owner = _owner;
        if (enableTokenAtInit == true) {
            _enableToken();
        }
    }

    /**
    * @dev enable Vlike token of this contract.
    * Requirements:
    * - token must not have been enabled in this contract.
    */
    function enableToken() external onlyOwner {
        _enableToken();
    }

    function _enableToken() internal {
        require(tokenEnabled == false, 'token already enabled');
        pools = new Pools(token);
        tokenEnabled = true;
    }
    /**
    * @dev Returns the base information of contract.
    */
    function getBaseInfo() external view returns (BaseInfo memory baseInfo) {
        return BaseInfo(
            name, 
            tokenEnabled,
            token.balanceOf(address(this)),
            linkToken.balanceOf(address(this)),
            owner
        );
    }

    /**
    * @dev register an item in this rating contract.
    * @param _urlData The value of this item, could be any string.
    */
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
        return item.itemID;
    }

    /**
    * @dev Rate an item.
    * @param _itemId The id of this item.
    * @param _score The value of rating.
    * Emits a {rateEvent} event.
    * Emits a {stakeEvent} event if token enabled.
    * Requirements:
    * - This item must not have been rated.
    */
    function rate(uint256 _itemId, bool _score) public returns(bool success) {
        require(userRating[msg.sender][_itemId].hasRated == false, 'Cannot rate twice!');

        if (tokenEnabled == true) {
            stake(_itemId, _score);
        }

        userRating[msg.sender][_itemId].hasRated = true;
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
        bytes32 requestId = requestRandomness(keyhash, linkFee);
        randomRequestMapping[requestId] = stakeInfo;

        emit stakeEvent(_itemId, msg.sender, requestId);
    }
    /**
    * @dev Returns the rating counts of the item.
    * @param _itemId The id of this item.
    */
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

    function fulfillRandomness(bytes32 _requestId, uint256 _randomness) internal override {
        require(_randomness > 0, "random not found");
        Pools.StakeInfo memory stakeInfo = randomRequestMapping[_requestId];
        pools.vote(stakeInfo, _randomness);
        if (checkDice(_randomness)) {
            uint256 itemId = stakeInfo.itemId;
            pools.reward(itemId, _randomness, feeRatio);
        }
    }

    function checkDice(uint256 _randomness) internal view returns (bool) {
        bool checked = _randomness % dice == 0;
        return checked;
    }

    function calculateRatingStake(uint256 _itemId) public view returns (uint256 stakeAmount, uint256 voteWeight) {
        uint256 index = itemMapping[_itemId].totalRatingCount + 1;
        return (_ether(1)/index, index);
    }

    // ether to wei
    function _ether(uint256 amountInEther) internal pure returns (uint256 amountInWei) {
        return amountInEther * 10 **18;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "you are not owner");
        _;
    }
}