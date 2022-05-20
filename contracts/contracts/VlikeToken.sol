// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VlikeToken is ERC20 {

    string public tag;
    address public owner;

    constructor(uint256 initialSupply) ERC20("VlikeToken", "VLIKE") {
        owner = msg.sender;
        _mint(owner, initialSupply);
    }

    function requestTokens() external {
        this.transferFrom(owner, msg.sender, _ether(10));
    }

    // ether to wei
    function _ether(uint256 amountInEther) internal pure returns (uint256 amountInWei) {
        return amountInEther * 10 **18;
    }
}