var Chat = artifacts.require("./Chat.sol");

contract('Chat', function(accounts) {
  var chatInstance;
  var sender1 = accounts[1];
  var sender2 = accounts[2];
  var message1 = "Hello!";
  var message2 = "Hey?";
  var watcher;

  //Test Case: Checking initial values
  it("should be initialized with empty values", function() {
    return Chat.deployed().then(function(instance) {
      chatInstance = instance;
      return chatInstance.getNumberOfMessages();
    }).then(function(data) {
      assert.equal(data, 0x0, "number of messages should be initialized as 0");
      return chatInstance.getChat();
    }).then(function(data) {
      assert.equal(data.length, 0, "number of messages should be 0");
    });
  });


  //Test Case: Sending first message
  it("should send a message", function() {
    return Chat.deployed().then(function(instance) {
      return instance.sendMessage(message1, {from:sender1});
    }).then(function(data) {
      assert.equal(data.logs.length, 1, "should have recieved one event");
      assert.equal(data.logs[0].event, "newMessageEvent", "event type should be newMessageEvent");
      assert.equal(data.logs[0].args._id.toNumber(), 1, "id should be 1");
      assert.equal(data.logs[0].args._sender, sender1, "sender must be " + sender1);
      assert.equal(data.logs[0].args._message, message1, "message must be " + message1);

      return chatInstance.getNumberOfMessages();
    }).then(function(data) {
      assert.equal(data, 1, "number of messages must be 1");
      return chatInstance.getChat();
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 1, "number of messages in chat must be 1");
      messageId = data[0].toNumber();
      return chatInstance.messages(messageId);
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 1, "article id must be 1");
    });
  });

  //Test Case: Sending second message
  it("should send second message", function() {
    return Chat.deployed().then(function(instance) {
      return instance.sendMessage(message2, {from:sender2});
    }).then(function(data) {
      assert.equal(data.logs.length, 1, "should have recieved one event");
      assert.equal(data.logs[0].event, "newMessageEvent", "event type should be newMessageEvent");
      assert.equal(data.logs[0].args._id.toNumber(), 2, "id should be 2");
      assert.equal(data.logs[0].args._sender, sender2, "sender must be " + sender2);
      assert.equal(data.logs[0].args._message, message2, "message must be " + message2);

      return chatInstance.getNumberOfMessages();
    }).then(function(data) {
      assert.equal(data, 2, "number of messages must be 2");
      return chatInstance.getChat();
    }).then(function(data) {
      assert.equal(data[1].toNumber(), 2, "number of messages in chat must be 2");
      messageId = data[1].toNumber();
      return chatInstance.messages(messageId);
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 2, "article id must be 2");
    });
  });

});
