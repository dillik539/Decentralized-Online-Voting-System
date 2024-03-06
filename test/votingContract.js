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
});
