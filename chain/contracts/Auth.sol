//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Auth {
    mapping(address => mapping(address => bytes)) public claims;

    function setClaim(address claimant, bytes calldata claim) public {
        claims[msg.sender][claimant] = claim;
    }
}
