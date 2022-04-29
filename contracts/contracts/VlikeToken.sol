// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VlikeToken is ERC20 {

    constructor(uint256 initialSupply) ERC20("VlikeToken", "VLIKE") {
        _mint(msg.sender, initialSupply);
    }
}
