App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    App.displayAccountInfo();
    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#account").text(account);
      }
      else if (err == null){
        ("#account").text("Not logged in");
      }
    });
  },

  initContract: function() {
    $.getJSON('Chat.json', function(chatArtifact) {
      // Get the necessary contract artifact file and use it to instantiate a truffle contract abstraction.
      App.contracts.Chat = TruffleContract(chatArtifact);

      // Set the provider for our contract.
      App.contracts.Chat.setProvider(App.web3Provider);

      // Listen for events
      App.listenToEvents();

      // Retrieve the message from the smart contract
      return App.reloadMessages();
    });
  },

  reloadMessages: function() {
    // avoid reentry
    if (App.loading) {
      return;
    }
    App.loading = true;

    var chatInstance;

    App.contracts.Chat.deployed().then(function(instance) {
      chatInstance = instance;
      return chatInstance.getChat();
    }).then(function(messageIds) {
      // Retrieve and clear the message placeholder
      var messageRow = $('#messageRow');
      messageRow.empty();
      for (var i = 0; i < messageIds.length; i++) {
        var messageId = messageIds[i];
        chatInstance.messages(messageId).then(function(message) {
          App.displayMessage(
            message[0],
            message[1],
            message[2]
          );
        });
      }
      App.loading = false;
    }).catch(function(err) {
      console.log(err.message);
      App.loading = false;
    }).then(function() {
      //Auto scroll to the bottom of the div so the latest message appears
      var chatBoxHeight = 1000;
      var chatBox = $('#panel-body');
      //chatBox.scrollTop = chatBox.scrollHeight;
      chatBox.scrollTop(chatBox[0].scrollHeight);
      console.log(chatBox);
      console.log(chatBox[0].scrollHeight);

    });
  },

  displayMessage: function(id, sender, message) {
    // Retrieve the message placeholder
    var messageRow = $('#messageRow');

    // Retrieve and fill the message template
    var messageTemplate = $('#messageTemplate');
    messageTemplate.find('.msg-text').text(message);
    messageTemplate.find('.msg-sender').text(sender);

    //Display delete button if user is the message sender
    if (sender == App.account) {
      messageTemplate.find('.msg-sender').text("You");
      messageTemplate.find('.btn-delete').show();
    } else {
      messageTemplate.find('.msg-sender').text(sender);
      messageTemplate.find('.btn-delete').hide();
    }

    //Add the message to the row
    messageRow.append(messageTemplate.html());

  },

  sendMessage: function() {
    //Retrieve message details
    var _newMessageText = $("#newMessageText").val();
    //Check if message is empty
    if (_newMessageText.trim() == '') {
      return false;
    }

    App.contracts.Chat.deployed().then(function(instance) {
      return instance.sendMessage(_newMessageText, {
        from: App.account,
        gas: 500000
      });
    }).catch(function(err) {
      console.error(err);
    });
  },

  // Listen for events raised from the contract
  listenToEvents: function() {
    App.contracts.Chat.deployed().then(function(instance) {
      instance.newMessageEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        if(error) {
          console.error(error);
        }
        App.reloadMessages();
      });
    });
  },
};

$(function() {
  $(window).on('load',function() {
    App.init();
  });
});
