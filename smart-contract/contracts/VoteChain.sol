// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./TransferHelper.sol";

contract VoteChain is Ownable {
    // Mapping of NPO (Non-Profit Organization) & Status
    mapping(address => bool) public npoList;

    // Mapping of Donors & Status
    mapping(address => bool) public donorList;

    // Mapping First Donatied
    mapping(address => bool) public firstDonation;

    // Mapping of Donation categories
    mapping(bytes32 => uint256) public donationAmountByCategory;

    // Mapping of ProposalId and Categories
    mapping(bytes32 => bytes32) public proposalCategories;

    // Mapping of Proposals
    mapping(bytes32 => bool) public proposals;

    // Mapping of Approved Proposals
    mapping(bytes32 => bool) public approvedProposals;

    // Mapping of Proposals & No.of Votes
    mapping(bytes32 => uint256) public voteCountForProposal;

    // Total No.of Proposals
    uint256 public totalProposals;

    // Mapping of Proposals & Vendors
    mapping(bytes32 => address[]) public vendorWallets;

    // Mapping of Proposals & Amounts
    mapping(bytes32 => uint256[]) public vendorAmounts;

    // Mapping of Vendor Invoices
    mapping(bytes32 => string) public vendorInvoices;

    // Mapping of donationCategory, donor & status of donation
    mapping(bytes32 => mapping(address => bool)) private categoryDonorRegistry;

    // Mapping of Unique donors of a category
    mapping(bytes32 => uint256) public uniqueDonorCount;

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
        string invoice,
        uint256 createdAt
    );
    event Voted(bytes32 proposalId, address indexed votedBy, uint256 votedAt);

    // Update NPO Wallet Status
    function updateNPO(address _npo, bool _status) public onlyOwner {
        require(_npo != address(0), "UpdateNPO:: Invalid Address");
        npoList[_npo] = _status;
        emit NPOUpdated(_npo, _status);
    }

    // Update Donor Wallet Status
    function updateDonor(address _donor, bool _status) public onlyOwner {
        require(_donor != address(0), "UpdateDonor:: Invalid Address");
        donorList[_donor] = _status;
        emit DonorUpdated(_donor, _status);
    }

    // Convert String to Keccak256
    function stringToKeccak256(
        string memory source
    ) public pure returns (bytes32 result) {
        result = keccak256(abi.encodePacked(source));
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
            uniqueDonorCount[categoryHash] += 1;
        }
        if (!firstDonation[msg.sender]) {
            firstDonation[msg.sender] = true;
            donorList[msg.sender] = true;
        }
    }

    // Donate to Category
    function donate(
        string memory category,
        address token,
        uint256 amount
    ) external {
        TransferHelper.safeTransferFrom(
            token,
            msg.sender,
            address(this),
            amount
        );
        updateCategoryDonation(category, amount);

        // TODO: Mint Donor NFT
        emit Donated(msg.sender, category, token, amount, block.timestamp);
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

    // Create Proposal
    function createProposal(
        string memory category,
        address[] memory vendors,
        uint256[] memory amounts,
        string memory invoices
    ) external {
        require(getNPOStatus(msg.sender), "CreateProposal:: Should be NPO");
        bytes32 proposalId = getProposalId(totalProposals);
        require(
            vendors.length == amounts.length,
            "CreateProposal:: Vendors & amounts count should be equal"
        );
        vendorWallets[proposalId] = vendors;
        vendorAmounts[proposalId] = amounts;
        vendorInvoices[proposalId] = invoices;
        proposalCategories[proposalId] = stringToKeccak256(category);
        totalProposals++;
        emit ProposalCreated(
            proposalId,
            msg.sender,
            category,
            vendors,
            amounts,
            invoices,
            block.timestamp
        );
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

    // Vote for a Proposal
    function voteToProposal(bytes32 proposalId) external {
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
        emit Voted(proposalId, msg.sender, block.timestamp);
    }
}
