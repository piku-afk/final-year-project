// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
  address public owner;
  mapping(int32 => int32) votes;
  bool ongoing = true;

  constructor(address _owner) {
    owner = _owner;
  }

  modifier isOwner() {
    require(owner == msg.sender);
    _;
  }

  function getOwner() public view returns(address) {
    return owner;
  }

  function closeElection() public isOwner {
    ongoing = false;
  }

  function vote(int32 voter, int32 option) public {
    votes[voter] = option;
  } 
}
