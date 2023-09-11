// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./TransferHelper.sol";

interface IVoteChainNFT {
    function mint(address wallet) external;
}

contract VoteChain is Ownable, ReentrancyGuard {
    // Mapping of NPO (Non-Profit Organization) & Status
    mapping(address => bool) internal npoList;

    // Mapping of NPO & Data
    mapping(address => string) internal npoData;

    // Mapping of Proposal & NPO
    mapping(bytes32 => address) internal ownerOfProposal;

    // Mapping of NPO Launched
    mapping(address => bytes32[]) internal nposProposals;

    // Mapping of NPOWallet
    address[] internal npoWallets;

    // Mapping of Donors & Status
    mapping(address => bool) internal donorList;

    // Mapping First Donatied
    mapping(address => bool) internal firstDonation;

    // Mapping of Donation categories
    mapping(bytes32 => uint256) internal donationAmountByCategory;

    // Mapping of ProposalId and Categories
    mapping(bytes32 => bytes32) internal proposalCategories;

    // Mapping of Approved Proposals
    mapping(bytes32 => bool) internal approvedProposals;

    // Mapping of Proposals & No.of Votes
    mapping(bytes32 => uint256) internal voteCountForProposal;

    // Total No.of Proposals
    uint256 internal totalProposals;

    // Mapping of Proposals & Vendors
    mapping(bytes32 => address[]) internal vendorWallets;

    // Mapping of Proposals & Amounts
    mapping(bytes32 => uint256[]) internal vendorAmounts;

    // Mapping of Vendor Invoices
    mapping(bytes32 => string) internal vendorInvoices;

    // Mapping of PrposalsId & Data
    mapping(bytes32 => string) internal proposalData;

    // Mapping of donationCategory, donor & status of donation
    mapping(bytes32 => mapping(address => bool)) private categoryDonorRegistry;

    // Mapping of Unique donors of a category
    mapping(bytes32 => uint256) internal uniqueDonorCount;

    // Mapping of Proposal Id & Donated Token
    mapping(bytes32 => address) internal proposalDonatedToken;

    // Donor NFT
    address public donorNFT;

    // Voter NFT
    address public voterNFT;

    // NPO NFT
    address public NPONFT;

    // Events
    event NPOUpdated(address indexed npo, bool status);
    event DonorUpdated(address indexed donor, bool status);
    event Donated(
        address indexed donor,
        string category,
        address token,
        uint256 amount,
        uint256 createdAt
    );
    event ProposalCreated(
        bytes32 proposalId,
        address indexed createdBy,
        string category,
        address[] vendors,
        uint256[] amounts,
        address token,
        string invoice,
        uint256 createdAt
    );
    event Voted(bytes32 proposalId, address indexed votedBy, uint256 votedAt);
    event Finalised(
        bytes32 proposalId,
        address finalisedBy,
        uint256 finalisedAt
    );

    // Donate to Category
    function donate(
        string memory category,
        address token,
        uint256 amount
    ) external nonReentrant {
        TransferHelper.safeTransferFrom(
            token,
            msg.sender,
            address(this),
            amount
        );
        updateCategoryDonation(category, amount);
        IVoteChainNFT(donorNFT).mint(msg.sender);
        emit Donated(msg.sender, category, token, amount, block.timestamp);
    }

    // Create Proposal
    function createProposal(
        string memory category,
        address[] memory vendors,
        uint256[] memory amounts,
        string memory invoices,
        address token,
        string memory data
    ) external nonReentrant {
        require(getNPOStatus(msg.sender), "CreateProposal:: Should be NPO");
        bytes32 proposalId = getProposalId(totalProposals);
        require(
            vendors.length == amounts.length,
            "CreateProposal:: Vendors & amounts count should be equal"
        );
        vendorWallets[proposalId] = vendors;
        vendorAmounts[proposalId] = amounts;
        vendorInvoices[proposalId] = invoices;
        proposalDonatedToken[proposalId] = token;
        proposalCategories[proposalId] = stringToKeccak256(category);
        proposalData[proposalId] = data;
        ownerOfProposal[proposalId] = msg.sender;
        nposProposals[msg.sender].push(proposalId);
        totalProposals++;
        emit ProposalCreated(
            proposalId,
            msg.sender,
            category,
            vendors,
            amounts,
            token,
            invoices,
            block.timestamp
        );
    }

    // Vote for a Proposal
    function voteToProposal(bytes32 proposalId) external nonReentrant {
        uint256 totalProposedAmount = getProposedAmountByProposalId(proposalId);
        uint256 balanceInCategory = donationAmountByCategory[
            proposalCategories[proposalId]
        ];
        require(
            balanceInCategory > totalProposedAmount,
            "VoteToProposal:: Insufficiant Funds in the Category"
        );
        require(isDonor(msg.sender), "VoteToProposal:: Only donors can vote");
        voteCountForProposal[proposalId]++;
        IVoteChainNFT(voterNFT).mint(msg.sender);
        emit Voted(proposalId, msg.sender, block.timestamp);
    }

    // Finalize the Proposal - anyone can call as long as the votes met the criteria
    function finaliseProposal(bytes32 proposalId) external nonReentrant {
        uint256 totalVotes = voteCountForProposal[proposalId];
        uint256 noOfUniqueDonors = uniqueDonorCount[proposalId];
        address payToken = proposalDonatedToken[proposalId];
        require(
            totalVotes * 100 > noOfUniqueDonors * 51,
            "FinaliseProposal:: Not enough votes to finalize the proposal"
        );
        for (uint256 i = 0; i < vendorWallets[proposalId].length; i++) {
            TransferHelper.safeTransfer(
                payToken,
                vendorWallets[proposalId][i],
                vendorAmounts[proposalId][i]
            );
        }
        approvedProposals[proposalId] = true;
        emit Finalised(proposalId, msg.sender, block.timestamp);
    }

    // Update NPO Wallet Status
    function updateNPO(
        address _npo,
        bool _status,
        string memory data
    ) public onlyOwner {
        require(_npo != address(0), "UpdateNPO:: Invalid Address");
        npoList[_npo] = _status;
        if (_status) {
            npoData[_npo] = data;
            npoWallets.push(_npo);
        } else {
            for (uint256 i = 0; i < npoWallets.length; i++) {
                if (npoWallets[i] == _npo) {
                    npoWallets[i] = npoWallets[npoWallets.length - 1];
                    npoWallets.pop();
                    break;
                }
            }
        }
        if (_status) {
            IVoteChainNFT(NPONFT).mint(msg.sender);
        }
        emit NPOUpdated(_npo, _status);
    }

    // Update Donor Wallet Status
    function updateDonor(address _donor, bool _status) public onlyOwner {
        require(_donor != address(0), "UpdateDonor:: Invalid Address");
        donorList[_donor] = _status;
        emit DonorUpdated(_donor, _status);
    }

    // Update Donor NFT Contract
    function updateDonorNFT(address nft) public onlyOwner {
        require(nft != address(0), "UpdateDonorNFT:: Invalid Address");
        donorNFT = nft;
    }

    // Update Voter NFT Contract
    function updateVoterNFT(address nft) public onlyOwner {
        require(nft != address(0), "UpdateVoterNFT:: Invalid Address");
        voterNFT = nft;
    }

    // Update NPO NFT Contract
    function updateNPONFT(address nft) public onlyOwner {
        require(nft != address(0), "UpdateNPONFT:: Invalid Address");
        NPONFT = nft;
    }

    // Update Category Donation
    function updateCategoryDonation(
        string memory category,
        uint256 amount
    ) internal {
        bytes32 categoryHash = stringToKeccak256(category);
        donationAmountByCategory[categoryHash] += amount;
        trackUniqueDonor(category, msg.sender);
    }

    // Tracking of Uniqe Donors & First Time Donation
    function trackUniqueDonor(string memory category, address donor) internal {
        bytes32 categoryHash = stringToKeccak256(category);
        if (!categoryDonorRegistry[categoryHash][donor]) {
            categoryDonorRegistry[categoryHash][donor] = true;
            uniqueDonorCount[categoryHash]++;
        }
        if (!firstDonation[msg.sender]) {
            firstDonation[msg.sender] = true;
            donorList[msg.sender] = true;
        }
    }

    // Get List of Open Proposals
    function getListOfOpenProposals() public view returns (bytes32[] memory) {
        bytes32[] memory openProposals = new bytes32[](totalProposals);
        uint256 count = 0;
        for (uint256 i = 0; i < totalProposals; i++) {
            if (!approvedProposals[getProposalId(i)]) {
                openProposals[count] = getProposalId(i);
                count++;
            }
        }
        return openProposals;
    }

    // Get the List of All Proposals Created by an NPO
    function getListOfAllProposalsByNPO(
        address npo
    ) public view returns (bytes32[] memory) {
        return nposProposals[npo];
    }

    // Get Proposer of NPO
    function getProposerOfProposalId(
        bytes32 proposalId
    ) public view returns (address) {
        return ownerOfProposal[proposalId];
    }

    // Convert String to Keccak256
    function stringToKeccak256(
        string memory source
    ) public pure returns (bytes32 result) {
        result = keccak256(abi.encodePacked(source));
    }

    // Get time stamp of first donation
    function getFirstDonation(address wallet) public view returns (bool) {
        return firstDonation[wallet];
    }

    // Check if the given wallet is npo or not
    function getNPOStatus(address npo) public view returns (bool) {
        return npoList[npo];
    }

    // Convert Number to Keccak256
    function getProposalId(
        uint256 number
    ) public pure returns (bytes32 result) {
        result = keccak256(abi.encodePacked(number));
    }

    // Get Donation Amount by Category
    function getDonationAmountByCategory(
        string memory category
    ) public view returns (uint256) {
        bytes32 categoryHash = stringToKeccak256(category);
        return donationAmountByCategory[categoryHash];
    }

    // Get Proposal Category
    function getProposalCategories(
        bytes32 catogery
    ) public view returns (bytes32) {
        return proposalCategories[catogery];
    }

    // Check if the Proposal status
    function isProposalApproved(bytes32 proposalId) public view returns (bool) {
        return approvedProposals[proposalId];
    }

    // Get the No.of Votes for Proposal
    function getVoteCountForProposal(
        bytes32 proposalId
    ) public view returns (uint256) {
        return voteCountForProposal[proposalId];
    }

    // Get List of Vendor Wallets for Proposal
    function getVendorWalletsForPorposal(
        bytes32 proposalId
    ) public view returns (address[] memory) {
        return vendorWallets[proposalId];
    }

    // Get Total No.of Proposals
    function getTotalProposals() public view returns (uint256) {
        return totalProposals;
    }

    // Get List of Vendor Amounts for Proposal
    function getVendorAmountsForPorposal(
        bytes32 proposalId
    ) public view returns (uint256[] memory) {
        return vendorAmounts[proposalId];
    }

    // Get List of Vendor Invoice IPFS
    function getVendorInvoices(
        bytes32 proposalId
    ) public view returns (string memory) {
        return vendorInvoices[proposalId];
    }

    // Get Unique donor count for Proposal
    function getUniqueDonorCount(
        bytes32 proposalId
    ) public view returns (uint256) {
        return uniqueDonorCount[proposalId];
    }

    // Get Proposal Donation Token
    function getProposalDonatedToken(
        bytes32 proposalId
    ) public view returns (address) {
        return proposalDonatedToken[proposalId];
    }

    // Get the Proposed Amount for a Proposal (will be paid to vendor)
    function getProposedAmountByProposalId(
        bytes32 proposalId
    ) public view returns (uint256) {
        uint256[] memory amounts = vendorAmounts[proposalId];
        uint256 temp = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            temp = temp + amounts[i];
        }
        return temp;
    }

    // Check if a wallet is a donor
    function isDonor(address wallet) public view returns (bool) {
        return donorList[wallet];
    }

    // Get All NPOWallets & NPO Data
    function getNPOInfo()
        public
        view
        returns (address[] memory, string[] memory)
    {
        address[] memory wallets = new address[](npoWallets.length);
        string[] memory data = new string[](npoWallets.length);
        for (uint256 i = 0; i < npoWallets.length; i++) {
            wallets[i] = npoWallets[i];
            data[i] = npoData[npoWallets[i]];
        }
        return (wallets, data); // URL
    }
}
