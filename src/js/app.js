/** @format */

App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== "undefined") {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("VotingContract.json", function (votingContract) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.VotingContract = TruffleContract(votingContract);
      // Connect provider to interact with contract
      App.contracts.VotingContract.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function () {
    var votingInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.VotingContract.deployed()
      .then(function (instance) {
        votingInstance = instance;
        return votingInstance.getNumberOfCandidate();
      })
      .then(function (numberOfCandidate) {
        var candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        var candidateSelect = $("#candidatesSelect");
        candidateSelect.empty();

        for (var i = 1; i <= numberOfCandidate; i++) {
          votingInstance.candidateDetails(i).then(function (candidate) {
            var id = candidate[0];
            var name = candidate[1];
            var numberOfVote = candidate[2];

            // Render candidate Result
            var candidateTemplate =
              "<tr><th>" +
              id +
              "</th><td>" +
              name +
              "</td><td>" +
              numberOfVote +
              "</td></tr>";
            candidatesResults.append(candidateTemplate);

            //Render candidate option for voting
            var candidateVoting =
              "<option value ='" + id + "' >" + name + "</ option>";
            candidateSelect.append(candidateVoting);
          });
        }
        return votingInstance.voters(App.account);
      })
      .then(function (hasVoted) {
        if (hasVoted) {
          $("form").hide();
        }
        loader.hide();
        content.show();
      })
      .catch(function (error) {
        console.warn(error);
      });
  },
  castVote: function () {
    var candidateId = $("#candidatesSelect").val();
    App.contracts.VotingContract.deployed()
      .then(function (instance) {
        return instance.castVote(candidateId, { from: App.account });
      })
      .then(function (result) {
        // Wait for votes to update
        $("#content").hide();
        $("#loader").show();
      })
      .catch(function (err) {
        console.error(err);
      });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
