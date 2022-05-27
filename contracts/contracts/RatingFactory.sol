//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./RatingSystem.sol";
import "./VlikeToken.sol";
import "./Pools.sol";

contract RatingFactory {

    mapping(address => address[]) public UserAddressToContractAddress;

    event createRatingEvent(
        address user,
        address ratingContract
    );

    /**
    * @dev create a new Rating contract.
    * @param name The name of this contract.
    * @param token The Vlike Token.
    * @param enableTokenAtInit Enable token when contract created.
    * @param dice The frequency of lottery reward winner. The smaller the value, the higher the frequency.
    * @param feeRatio Transaction fees of owner of contract.
    * @param vrfCoordinator Chainlink vrf.
    * @param link Link token.
    * @param keyhash vrf keyhash.
    * Emits a {createRatingEvent} event.
    * Requirements:
    * - `dice` must be bigger than 1
    * - `feeRatio` must be small than 100
    */
    function createRatingSystemContract(
        string memory name,
        VlikeToken token,
        bool enableTokenAtInit,
        uint256 dice,
        uint256 feeRatio,
        address vrfCoordinator,
        address link,
        bytes32 keyhash
    ) public returns(Rating tokenAddress){
        Rating ratingContract = new Rating(
            name,
            token,
            enableTokenAtInit,
            dice,
            feeRatio,
            vrfCoordinator,
            link,
            keyhash,
            msg.sender
        );
        UserAddressToContractAddress[msg.sender].push(address(ratingContract));

        emit createRatingEvent(msg.sender, address(ratingContract));

        return ratingContract;
    }
    /**
    * @dev Returns the contracts count a user has created.
    * @param user The address of user.
    */
    function getContractCount(address user) public view returns(uint256 count) {
        return UserAddressToContractAddress[user].length;
    }
    /**
    * @dev Returns the contract of user by index.
    * @param user The address of user.
    * @param index The index of contract.
    */
    function getContract(address user, uint256 index) public view returns (address) {
        uint256 length = getContractCount(user);
        require(index < getContractCount(user), 'index out of array length');
        return UserAddressToContractAddress[user][index];
    }
}