// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VerifyXSBT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;
mapping(address => bool) private minted;

event Attest(address indexed to, uint256 indexed tokenId);
event Revoke(address indexed to, uint256 indexed tokenId);

constructor() ERC721("VerifyXSBT", "VXT") {}

function safeMint(address to, string memory uri) public {
    require(!minted[to], "Address can only mint one token");
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    minted[to] = true;
}

function burn(uint256 tokenId) external {
    require(ownerOf(tokenId) == msg.sender, "Only owner of the token can burn it");
    _burn(tokenId);
}

function revoke(uint256 tokenId) external onlyOwner {
    _burn(tokenId);
}

function _beforeTokenTransfer(address from, address to, uint256) pure internal {
    require(from == address(0) || to == address(0), "Not allowed to transfer token");
}

function _afterTokenTransfer(address from, address to, uint256 tokenId) internal {

    if (from == address(0)) {
        emit Attest(to, tokenId);
    } else if (to == address(0)) {
        emit Revoke(to, tokenId);
    }
}

function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    minted[ownerOf(tokenId)] = false;
    super._burn(tokenId);
}

function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
{
    return super.tokenURI(tokenId);
}
}