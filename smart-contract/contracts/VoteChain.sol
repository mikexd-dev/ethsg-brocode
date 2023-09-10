// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./TransferHelper.sol";

contract VoteChain is Ownable {
    // Mapping of NPO (Non-Profit Organization) & Status
    mapping(address => bool) public npoList;

    // Mapping of Donors & Status
    mapping(address => bool) public donorList;

    // Mapping of Donation categories
    mapping(bytes32 => uint256) public donationCategory;

    // Events
    event NPOUpdated(address indexed npo, bool status);
    event DonorUpdated(address indexed donor, bool status);
    event Donated(
        address indexed donor,
        string category,
        address token,
        uint256 amount,
        uint256 when
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
        emit Donated(msg.sender, category, token, amount, block.timestamp);
    }
}
