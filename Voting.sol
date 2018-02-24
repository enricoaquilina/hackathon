pragma solidity ^0.4.11;
// We have to specify what version of compiler this code will compile with

contract Voting {
  /* mapping field below is equivalent to an associative array or hash.
  The key of the mapping is candidate name stored as type bytes32 and value is
  an unsigned integer to store the vote count
  */

  mapping (bytes32 => uint8) public votesReceived;
  mapping (bytes32 => bool) public validCandidates;

  /* This is the constructor which will be called once when you
  deploy the contract to the blockchain. When we deploy the contract,
  we will pass an array of candidates who will be contesting in the election
  */
  function Voting(bytes32[] candidateNames) {
    for(uint i = 0; i < candidateNames.length; i++) {
      validCandidates[candidateNames[i]] = true;
    }
  }

  // function getList() constant returns () {
  //   return votesReceived;
  // }

  // This function returns the total votes a candidate has received so far
  function totalVotesFor(bytes32 candidate) constant returns (uint8) {
    return votesReceived[candidate];
  }

  // This function increments the vote count for the specified candidate. This
  // is equivalent to casting a vote
  function voteForCandidate(bytes32 candidate) onlyForValidCandidate(candidate) {
    votesReceived[candidate] += 1;
  }

  function isValidCandidate(bytes32 candidate) returns (bool) {
    return validCandidates[candidate];
  }

  modifier onlyForValidCandidate(bytes32 candidate) {
    require (isValidCandidate(candidate));
    _;
  }
}