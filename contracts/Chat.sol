pragma solidity ^0.4.11;

import "./Owned.sol";

contract Chat is Owned{

  //Message obj
  struct Message {
    uint id;
    address sender;
    string message;
  }

  //State Variables
  mapping(uint => Message) public messages;
  uint messageIdCounter;

  //Events
  event newMessageEvent(uint indexed _id, address indexed _sender, string _message);

  //Send message
  function sendMessage(string _message) public {
    messageIdCounter++;

    //Store message
    messages[messageIdCounter] = Message(
      messageIdCounter,
      msg.sender,
      _message
    );

    //Trigger event
    newMessageEvent(messageIdCounter, msg.sender, _message);
  }

  //Get messages that are not empty
  function getChat() public constant returns (uint[]){
    if(messageIdCounter == 0) {
      return new uint[](0);
    }

    uint[] memory messageIdsNotEmpty = new uint[](messageIdCounter);
    uint numOfMessages = 0;
    for (uint i = 1; i <= messageIdCounter; i++) {
      //Get message ids that are not deleted
      if(messages[i].sender != 0x0) {
        messageIdsNotEmpty[numOfMessages] = messages[i].id;
        numOfMessages++;
      }
    }

    //Shrink the size of the array so user does not get sent empty messages
    uint[] memory messageStorage = new uint[](numOfMessages);
    for(uint j = 0; j < numOfMessages; j++) {
      messageStorage[j] = messageIdsNotEmpty[j];
    }
    return messageStorage;

  }

  function getNumberOfMessages() public constant returns (uint) {
    return messageIdCounter;
  }
/*
  function hideMessage(uint _id) public {
    //Make sure user is not trying to delete out of bounds message
    require(_id <= messageIdCounter);

    Message storage message = messages[_id];
    //Make sure users cannot delete someone else's messages
    require(messages[_id].sender == msg.sender);


  }*/

  function kill() onlyOwner {
    selfdestruct(owner);
  }


}
