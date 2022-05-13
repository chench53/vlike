// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VlikeToken.sol";

contract Pools {

    VlikeToken public token;

    constructor (
        VlikeToken _token
    ) {
        token = _token;
    }

    
}
