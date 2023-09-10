// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoteChainDonorNFT is ERC721A, Ownable {
    constructor() ERC721A("Donor", "Donor") {}

    string public baseURI;

    mapping(address => bool) public allowMint;

    function updateAllowedList(address wallet, bool status) external onlyOwner {
        require(wallet != address(0), "UpdateAllowedList:: Invalid Address");
        allowMint[wallet] = status;
    }

    function mint(address wallet) public {
        require(wallet != address(0), "Mint:: Invalid Address");
        require(allowMint[msg.sender], "Mint:: Unauthorised");
        _mint(wallet, 1);
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

    // prevent user to transfer NFT to someother wallet
    function transferFrom(address from, address to, uint256 tokenId) public virtual override payable {
        revert("Transfers are disabled");
    }
}
