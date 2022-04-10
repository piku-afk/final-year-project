// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Account.sol';

contract Auth {
  uint256 usersCount = 0;
  mapping(address => address) users;

  function signUp(bytes32 nounce, string memory name) public returns(address) {
    require(users[msg.sender] == address(0), 'An account already exists.');
    Account newAccount = new Account(nounce, name, msg.sender);
    users[msg.sender] = address(newAccount);
    return address(newAccount);
  }

  function getAccountAddress () public view returns (address) {
    // Login - Step 1: get Contract Account's address || address(0)
    return users[msg.sender];
  }

  function verify(bytes32 h, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
    return ecrecover(h, v, r, s);
  }
}

