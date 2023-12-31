// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoteChainNPONFT is ERC721A, Ownable {
    constructor() ERC721A("NPO", "NPO") {}

    string public baseURI;

    mapping(address => bool) public allowMint;

    function updateAllowedList(address wallet, bool status) external onlyOwner {
        require(wallet != address(0), "UpdateAllowedList:: Invalid Address");
        allowMint[wallet] = status;
    }

    function mint(address wallet) public {
        require(wallet != address(0), "Mint:: Invalid Address");
        require(allowMint[msg.sender], "Mint:: Unauthorised");
        if (balanceOf(wallet) == 0) {
            _mint(wallet, 1);
        }
    }

    function burn(uint256 tokenId) external {
        _burn(tokenId);
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}
