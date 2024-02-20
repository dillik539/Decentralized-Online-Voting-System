pragma solidity >=0.4.17;
contract VotingContract {
    address public owner;
    uint numberOfCandidate;
    uint numberOfVoters;

constructor() public {
    owner = msg.sender;
    numberOfCandidate = 0;
    numberOfVoters = 0;
}

function getOwner() public view returns(address) {
    return owner;
}

modifier onlyAdmin() {
    require(owner == msg.sender);
    _;
}

struct Candidate {
    uint id;
    string name;
    uint numOfVote;
}

mapping(uint => Candidate) public CandidateDetails;

function addCandidate(string memory _name) public onlyAdmin {
    Candidate memory newCandidate = Candidate({
        id:numberOfCandidate,
        name: _name,
        numOfVote: 0
    });
    CandidateDetails[numberOfCandidate] = newCandidate;
    numberOfCandidate += 1;
}
function getNumberOfCandidate() public view returns (uint){
    return numberOfCandidate;
}
}