// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./VlikeToken.sol";

contract Pools {

    VlikeToken public token;
    address public owner;

    struct StakeInfo {
        uint256 itemId;
        address rater;
        bool rating;
        uint256 stakeAmount;
        uint256 voteWeight;
        uint256 votes;
    }
    // itemid => rating => StakeInfo
    mapping(uint256 => mapping(bool => StakeInfo[])) public itemPoolMapping;

    event voteEvent(
        uint256 itemId,
        address voter,
        uint256 votedIndex
    );

    event rewardEvent(
        uint256 itemId,
        address winner,
        uint256 rewardAmount,
        uint256 feeAmount
    );

    constructor (
        VlikeToken _token
    ) {
        token = _token;
        owner = msg.sender;
    }

    function stake(uint256 _itemId, bool _score, StakeInfo memory stakeInfo) external onlyOwner {
        itemPoolMapping[_itemId][_score].push(stakeInfo);
    }

    function vote(StakeInfo memory stakeInfo, uint256 _randomness) external onlyOwner {
        bool rating = stakeInfo.rating;
        uint256 selectedIndex = _randomness % itemPoolMapping[stakeInfo.itemId][rating].length;
        itemPoolMapping[stakeInfo.itemId][rating][selectedIndex].votes += stakeInfo.voteWeight;

        emit voteEvent(stakeInfo.itemId, stakeInfo.rater, selectedIndex);
    }

    function reward(
        uint256 _itemid, 
        uint256 _randomness, 
        uint256 _feeRatio
    ) external onlyOwner returns (address, uint256, uint256) {
        uint256 rewardAmount;
        uint256 totalVotes;
        for (uint256 i=0; i < itemPoolMapping[_itemid][false].length; i++) {
            rewardAmount += itemPoolMapping[_itemid][false][i].stakeAmount;
            totalVotes += itemPoolMapping[_itemid][false][i].votes;
        }
        for (uint256 i=0; i<itemPoolMapping[_itemid][true].length; i++) {
            rewardAmount += itemPoolMapping[_itemid][true][i].stakeAmount;
            totalVotes += itemPoolMapping[_itemid][false][i].votes;
        }

        uint256 cursor = _randomness % totalVotes; 
        address winner = _findWinner(_itemid, cursor);
        uint256 feeAmount = rewardAmount * _feeRatio / 100;
        rewardAmount -= feeAmount;
        token.transfer(owner, feeAmount);
        token.transfer(winner, rewardAmount);
        resetPool(_itemid);

        emit rewardEvent(_itemid, winner, rewardAmount, feeAmount);

        return (winner, rewardAmount, totalVotes);
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

    modifier onlyOwner {
        require(msg.sender == owner, "you are not owner of pools");
        _;
    }
}
