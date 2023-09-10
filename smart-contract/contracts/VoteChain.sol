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
    mapping(bytes32 => uint256) public donationCategory;

    // Mapping of Proposals
    mapping(bytes32 => bool) public proposals;

    // Mapping of Approved Proposals
    mapping(bytes32 => bool) public approvedProposals;

    // Total No.of Proposals
    uint256 public totalProposals;

    // Mapping of Proposals & Vendors
    mapping(bytes32 => address[]) public vendorWallets;

    // Mapping of Proposals & Amounts
    mapping(bytes32 => uint256[]) public vendorAmounts;

    // Mapping of Vendor Invoices
    mapping(bytes32 => string) public vendorInvoices;

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
        donationCategory[categoryHash] =
            donationCategory[categoryHash] +
            amount;
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
        if (!firstDonation[msg.sender]) {
            firstDonation[msg.sender] = true;
        }
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
}
