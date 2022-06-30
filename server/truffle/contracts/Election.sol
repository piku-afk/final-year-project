// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
  address owner;
  mapping(int32 => int32) votes;
  mapping(int32 => bool) voters;
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

  function getVoterStatus(int32 voter) public view returns(bool) {
    return voters[voter];
  }

  function getVotesCount(int32 candidate) public view returns(int32) {
    return votes[candidate];
  }

  function closeElection() public isOwner {
    ongoing = false;
  }

  function vote(int32 voter, int32 option) public returns(bool) {
    if(!ongoing) {
      return false;
    }
    votes[option] += 1;
    voters[voter] = true;
    return true;
  } 
}
