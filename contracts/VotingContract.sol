pragma solidity >=0.4.2;
contract VotingContract {
    address public owner;
    uint numberOfCandidate;
    uint numberOfVoters;

constructor() public {
    //owner = msg.sender;
    //numberOfCandidate = 0;
    //numberOfVoters = 0;
    addCandidate("John");
    addCandidate("Micheal");
}

function getOwner() public view returns(address) {
    return owner;
}

modifier onlyAdmin() {
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

function addCandidate(string memory _name) private {
    // Candidate memory newCandidate = Candidate({
    //     id:numberOfCandidate,
    //     name: _name,
    //     numOfVote: 0
    // });
    //CandidateDetails[numberOfCandidate] = newCandidate;
    numberOfCandidate ++;
    candidateDetails[numberOfCandidate] = Candidate(numberOfCandidate, _name, 0);
}

function getNumberOfCandidate() public view returns (uint){
    return numberOfCandidate;
}
function getNumberOfVoters() public view returns (uint) {
    return numberOfVoters;
}

function makeProposal(string memory _name) public onlyAdmin(){
    //TODO: make proposal for a candidate
}
function setProposalDuration(uint duration) public {
    //TODO: set the proposal duration
}

}