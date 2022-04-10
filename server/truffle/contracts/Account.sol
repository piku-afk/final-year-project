// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Account {
  bytes32 nonce;
  string username;
  address owner;

  constructor(bytes32 _nonce, string memory _name, address _owner) {
    nonce = _nonce;
    username = _name;
    owner = _owner;
  }

  function getNonce() public view returns (bytes32) {
    // Login - Step 2: get msg.sender's Account nounce
    return nonce;
  }

  function verify(
      bytes32 h, uint8 v, bytes32 r, bytes32 s
    ) public view returns(bool) {
    // Login - Step 3: send hash to verify and complete login
    return ecrecover(h, v, r, s) == owner;
  }
  
}
