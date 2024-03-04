/** @format */

var VotingContract = artifacts.require("./VotingContract.sol");

contract("VotingContract", function (accounts) {
  it("initailizes with two candidates", function () {
    return VotingContract.deployed()
      .then(function (instance) {
        return instance.getNumberOfCandidate();
      })
      .then(function (count) {
        assert.equal(count, 2);
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
});
