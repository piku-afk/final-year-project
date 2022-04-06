// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auth {
  uint256 usersCount = 0;
  // struct User {

  // }

  function verify(bytes32 h, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
    return ecrecover(h, v, r, s);
  }
}


// Auth -> Account