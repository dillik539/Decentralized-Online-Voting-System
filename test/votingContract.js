/** @format */

const { assert } = require("chai");

var VotingContract = artifacts.require("./VotingContract.sol");

contract("VotingContract", function (accounts) {
  //this is accessible for all the tests
  let votingContractInstance;

  it("initailizes with three candidates", function () {
    return VotingContract.deployed()
      .then(function (instance) {
        return instance.getNumberOfCandidate();
      })
      .then(function (count) {
        assert.equal(count, 3);
      });
  });

  it("initailizes with zero voter count", function () {
    return VotingContract.deployed()
      .then(function (instance) {
        return instance.getNumberOfVoters();
      })
      .then(function (count) {
        assert.equal(count, 0);
      });
  });

  it("initailizes candidates with correct attributes", function () {
    return VotingContract.deployed()
      .then(function (instance) {
        votingContractInstance = instance;
        return votingContractInstance.candidateDetails(1);
      })
      .then(function (candidateDetail) {
        assert.equal(candidateDetail[0], 1, "contains the correct id");
        assert.equal(candidateDetail[1], "John", "contains the correct name");
        assert.equal(candidateDetail[2], 0, "contains correct number of votes");
        return votingContractInstance.candidateDetails(2);
      })
      .then(function (candidateDetail) {
        assert.equal(candidateDetail[0], 2, "contains the correct id");
        assert.equal(
          candidateDetail[1],
          "Micheal",
          "contains the correct name"
        );
        assert.equal(
          candidateDetail[2],
          0,
          "contains the corret number of votes"
        );
      });
  });

  it("It allows a voter to cast a vote", function () {
    return VotingContract.deployed()
      .then(function (instance) {
        votingContractInstance = instance;
        candidateId = 1;
        return votingContractInstance.castVote(candidateId, {
          from: accounts[0],
        });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "An event was triggered");
        assert.equal(
          receipt.logs[0].event,
          "voteCastedEvent",
          "The event type is correct"
        );
        assert.equal(
          receipt.logs[0].args._candidateId.toNumber(),
          candidateId,
          "The candidate id is correct"
        );
        return votingContractInstance.voters(accounts[0]);
      })
      .then(function (voted) {
        assert(voted, "the voter was marked as voted");
        return votingContractInstance.candidateDetails(candidateId);
      })
      .then(function (candidate) {
        var noOfVote = candidate[2];
        assert.equal(noOfVote, 1, "increments the candidate's vote count");
      });
  });

  it("Throws an exception for invalid candidates", function () {
    return VotingContract.deployed()
      .then(function (instance) {
        votingContractInstance = instance;
        return votingContractInstance.castVote(20, { from: accounts[1] });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "Error message must contain revert"
        );
        return votingContractInstance.candidateDetails(1);
      })
      .then(function (John) {
        var numOfVote = John[2];
        assert.equal(numOfVote, 1, "John did  not receive any votes");
        return votingContractInstance.candidateDetails(2);
      })
      .then(function (Michael) {
        var numOfVote = Michael[2];
        assert.equal(numOfVote, 0, "Michael did not receive any votes");
      });
  });
  //TODO: This test fails. Check for error
  it("Throws an exception for double voting", function () {
    return VotingContract.deployed()
      .then(function (instance) {
        votingContractInstance = instance;
        id = 2;
        votingContractInstance.castVote(id, { from: accounts[1] });
        return votingContractInstance.candidateDetails(id);
      })
      .then(function (candidate) {
        var numOfVote = candidate[2];
        assert.equal(numOfVote, 1, "Accepts first vote from the voter");
        //Try voting again the same candidate
        return votingContractInstance.castVote(id, { from: accounts[1] });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "Error message must contain revert"
        );
        return votingContractInstance.candidateDetails(1);
      })
      .then(function (John) {
        var numOfVote = John[2];
        assert.equal(numOfVote, 1, "John did not receive any votes");
        return votingContractInstance.candidateDetails(2);
      })
      .then(function (Michael) {
        var numOfVote = Michael[2];
        assert.equal(numOfVote, 1, "Michael did not receive any votes");
      });
  });
});
