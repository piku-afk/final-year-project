// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Election.sol';

contract ElectionFactory {
  uint256 public electionCount = 0;
  mapping(address => address) public elections; 

  function deploy(address owner) public returns(address) { 
    address newElectionAddress = address(new Election(owner));
    elections[owner] = newElectionAddress;
    electionCount++;
    return elections[owner];
  }

}
