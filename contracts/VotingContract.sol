// SPDX-License-Identifier: MIT
//src: https://www.dappuniversity.com/articles/the-ultimate-ethereum-dapp-tutorial
//solidity version greater than or equal to 0.4.2
pragma solidity >=0.4.2;
//smart contract holds all business
//logic of the application.
contract VotingContract {
    address public owner;
    uint numberOfCandidate;
    uint numberOfVoters;

//constructor
constructor() public {
    owner = msg.sender;
    numberOfCandidate = 0;
    numberOfVoters = 0;
}
//modifier
modifier onlyAdmin {
    require(owner == msg.sender);
    _;
}
//candidate blueprint
struct Candidate {
    uint id;
    string name;
    uint numOfVote;
}

//store instanciated candidate as a key value pair
mapping(uint => Candidate) public candidateDetails;

/*store voters information with address as key and boolean value as value.
value is initially false to indicate that voter has not voted yet. After
casting vote, the value will be set to true.
*/
mapping(address => bool) public voters;

//vote casted event
event voteCastedEvent (
    uint indexed _candidateId
);

//This function adds the candidate for voting process
function addCandidate(string memory _name) public {
    numberOfCandidate ++;
    candidateDetails[numberOfCandidate] = Candidate(numberOfCandidate, _name, 0);
}
//this returns the address of the owner or the user
function getOwner() public view returns(address) {
    return owner;
}
//this returns the number of candidates added
function getNumberOfCandidate() public view returns (uint){
    return numberOfCandidate;
}
//this returns the number of voters
function getNumberOfVoters() public view returns (uint) {
    return numberOfVoters;
}
//This function helps cast the vote, mark user as voted, and increases
//the number of votes received by the specific candidate by one
function castVote(uint _candidateId) public {
    //ensure the voter hasnot voted yet.
    require(!voters[msg.sender]);
    //ensure the vote will be cast only to listed candidate.
    require(_candidateId > 0 && _candidateId <= numberOfCandidate);
    //increase the number of votes received by candidate by 1
    candidateDetails[_candidateId].numOfVote++;
    //indicate that the voter has voted.
    voters[msg.sender] = true;
    //trigger vote casted event
    emit voteCastedEvent(_candidateId);
}
}