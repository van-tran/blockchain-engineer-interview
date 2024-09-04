// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AccessControl {

    event AccessGranted(address indexed account, string docId);
    event AccessRevoked(address indexed account, string docId);

    mapping(string => address) private docOwners;
    mapping(bytes32 => bool) private accessList;

    function registerDoc(string memory docId) public {
        require(docOwners[docId] == address(0), "Doc already registered");
        docOwners[docId] = msg.sender;
    }

    function transferDoc(string memory docId, address newOwner) public {
        require(docOwners[docId] == msg.sender, "Access denied");
        docOwners[docId] = newOwner;
    }

    function removeDoc(string memory docId) public {
        require(docOwners[docId] == msg.sender, "Access denied");
        docOwners[docId] = address(0);
    }

    modifier docOwner(string memory docId){
        require(docOwners[docId] == msg.sender, "Owner access denied");
        _;
    }

    modifier hasPermission(string memory docId){
        require(verifyAccess(msg.sender, docId) == true , "Access denied");
        _;
    }

    function grantAccess(address account, string memory docId) public docOwner(docId) {
        bytes32 message = generateMessageHash(account, docId);
        require(verifyAccess(account, docId) == false, "Access already granted");
        accessList[message] = true;
        emit AccessGranted(account, docId);
    }

    function revokeAccess(address account, string memory docId) public docOwner(docId) {
        bytes32 message = generateMessageHash(account, docId);
        require(verifyAccess(account, docId) == true, "Access already revoked");
        accessList[message] = false;
        emit AccessRevoked(account, docId);
    }

    function verifyOwner(string memory docId) public view returns (bool){
        return docOwners[docId] == msg.sender;
    }

    function verifyAccess(address account, string memory docId) public view returns (bool){
        bytes32 message = generateMessageHash(account, docId);
        return accessList[message] || docOwners[docId] == account;
    }

    function generateMessageHash(address account, string memory docId) private view returns (bytes32) {
        return keccak256(abi.encodePacked(account, docId));
    }
}
