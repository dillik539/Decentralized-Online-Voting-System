/** @format */

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
      App.listenForEvents();
      return App.render();
    });
  },

  listenForEvents: function () {
    App.contracts.VotingContract.deployed().then(function (instance) {
      instance
        .voteCastedEvent(
          {},
          {
            fromBlock: 0,
            toBlock: "latest",
          }
        )
        .watch(function (error, event) {
          console.log("Event triggered", event);
          return App.render();
        });
    });
  },

  render: function () {
    var votingInstance;
    var loader = $("#loader");
    var content = $("#content");
    var info = $("#infoMessage");
    var addressInfo = $("#accountAddress");
    const message =
      "Thank you for voting. Your vote has been successfully recorded! Please see the live result above.";

    loader.show();
    content.hide();
    //login();

    //Load account data
    web3.eth.getAccounts(function (err, accounts) {
      if (err === null) {
        App.account = accounts[0];
        $("#accountAddress").html("Your Account: " + accounts[0]);
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
          info.html(message);
        }
        loader.hide();
        content.show();
      })
      .catch(function (error) {
        console.warn(error);
      });
    addressInfo.show();
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
        console.error("error", err);
      });
  },
  //   login: async function () {
  //     var web3;
  //     await window.web3.currentProvider.enable();
  //     web3 = new Web3(window.web3.currentProvider);
  //   },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
