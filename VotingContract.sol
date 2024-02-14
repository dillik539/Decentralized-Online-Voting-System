pragma solidity >=0.4.17;
contract VoteContract {
    address public owner;
    uint numberOfCandidate;
    uint numberOfVoters;

function VoteContract() public {
    owner = msg.sender;
    numberOfCandidate = 0;
    numberOfVoters = 0;
}

function getOwner() public view returns(address) {
    return owner;
}

modifier onlyAdmin() {
    require(msg.sender = owner);
    _;
}

struct Candidate {
    uint id;
    string name;
    uint numOfVote;
}

mapping(uint => Candidate) public CandidateDetails;

function addCandidate(string _name, string) public onlyAdmin {
    Candidate memory newCandidate = Candidate({
        id:numberOfCandidate;
        name: _name;
        numOfVote: 0;
    });
    candidateDetails[numberOfCandidate] = newCandidate;
    numberOfCandidate += 1;
}
}