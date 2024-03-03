/** @format */

var votingContract = artifacts.require("./VotingContract.sol");

module.exports = function (deployer) {
  deployer.deploy(votingContract);
};
