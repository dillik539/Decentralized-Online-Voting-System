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
    var addCandidate = $("#addCandidate");
    var info = $("#infoMessage");
    var addressInfo = $("#accountAddress");
    var candidatesResults = $("#candidatesResults");
    var candidateSelect = $("#candidatesSelect");
    var displayForm = $("#displayForm");
    const message =
      "Thank you for voting. Your vote has been successfully recorded! Please see the live result above.";

    loader.show();
    addCandidate.hide();
    content.hide();

    //Load account data
    web3.eth.getAccounts(function (err, accounts) {
      if (err === null) {
        App.account = accounts[0];
        addressInfo.html("Your Account: " + accounts[0]);
      }
    });

    // Load contract data
    App.contracts.VotingContract.deployed()
      .then(function (instance) {
        votingInstance = instance;
        return votingInstance.getNumberOfCandidate();
      })
      .then(function (numberOfCandidate) {
        candidatesResults.empty();
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
          displayForm.hide();
          info.html(message);
        }
        loader.hide();
        content.show();
        addCandidate.show();
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

  //add candidate
  addCandidate: function () {
    var addName = $("#name").val();
    App.contracts.VotingContract.deployed().then(function (instance) {
      return instance.addCandidate(addName, { from: App.account });
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
