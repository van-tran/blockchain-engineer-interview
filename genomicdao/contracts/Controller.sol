pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./NFT.sol";
import "./Token.sol";
import "./AccessControl.sol";

contract Controller is AccessControl{
    using Counters for Counters.Counter;

    //
    // STATE VARIABLES
    //
    Counters.Counter private _sessionIdCounter;
    GeneNFT public geneNFT;
    PostCovidStrokePrevention public pcspToken;

    struct UploadSession {
        uint256 id;
        address user;
        string proof;
        bool confirmed;
    }

    struct DataDoc {
        string id;
        string hashContent;
    }

    mapping(uint256 => UploadSession) sessions;
    mapping(string => DataDoc) docs;
    mapping(string => bool) docSubmits;
    mapping(uint256 => string) nftDocs;

    //
    // EVENTS
    //
    event UploadData(string docId, uint256 sessionId);

    constructor(address nftAddress, address pcspAddress) {
        geneNFT = GeneNFT(nftAddress);
        pcspToken = PostCovidStrokePrevention(pcspAddress);
    }

    function uploadData(string memory docId) public returns (uint256) {
        // TODO: Implement this method: to start an uploading gene data session. The doc id is used to identify a unique gene profile. Also should check if the doc id has been submitted to the system before. This method return the session id
        // 0. check if the docId is existed in docSubmits
        require(docSubmits[docId] != true, "Doc already been submitted");

        // 2. create a new session

        uint256 sessionId = _sessionIdCounter.current();
        _sessionIdCounter.increment();

        sessions[sessionId] = UploadSession(sessionId, msg.sender, "success", false);
        docSubmits[docId] = true;

        // 2.1. grant access to the user
        registerDoc(docId);

        // 3. notify FE to proceed next step (review & confirm)
        emit UploadData(docId, sessionId);

        // 4. return sessionId
        return sessionId;

    }

    function confirm(
        string memory docId,
        string memory contentHash,
        string memory proof,
        uint256 sessionId,
        uint256 riskScore
    ) public docOwner(docId) {
        // TODO: Implement this method: The proof here is used to verify that the result is returned from a valid computation on the gene data. For simplicity, we will skip the proof verification in this implementation. The gene data's owner will receive a NFT as a ownership certificate for his/her gene profile.

        // TODO : validate sessionId
        require(sessions[sessionId].id == sessionId, "Session is ended");
        require(sessions[sessionId].user == msg.sender, "Invalid session owner");
        require(sessions[sessionId].confirmed == false, "Doc already been submitted");



        // TODO: Verify proof, we can skip this step

        // TODO: Update doc content
        docs[docId] = DataDoc(docId, contentHash);

        // TODO: Mint NFT
        uint256 tokenId = geneNFT.safeMint(msg.sender);
        nftDocs[tokenId] = docId;

        // TODO: Reward PCSP token based on risk stroke
        pcspToken.reward(msg.sender, riskScore);

        // TODO: Close session
        sessions[sessionId].confirmed = true;
    }

    function getSession(uint256 sessionId) public view returns(UploadSession memory) {
        return sessions[sessionId];
    }

    function getDoc(string memory docId) public hasPermission(docId) view returns(DataDoc memory) {
        return _getDoc(docId);
    }
    function _getDoc(string memory docId) private view returns(DataDoc memory) {
        return docs[docId];
    }
}
