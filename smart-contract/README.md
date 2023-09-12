# VoteChain - A Decentralized Voting and Donation Platform

## Overview
VoteChain is a blockchain-enabled, vote-weighted donation platform that aims to increase transparency, reduce donor fatigue, and improve tracking in the donation system. By harnessing the power of blockchain, VoteChain establishes a decentralized and secure platform where donors can contribute funds and participate in voting for the allocation of resources to different causes and projects.

## Features
 - NPO Registration: Allows the registration of Non-Profit Organizations along with storing associated data.
 - Donation Management: Donors can donate to different categories using supported tokens. 
 - Donation details including the category and amount are recorded on the blockchain.
 - Proposal Creation: Registered NPOs can create proposals specifying the vendors, amount, and other necessary details.
 - Community Voting: Allows community members to vote on proposals, ensuring a decentralized decision-making process.
 - Proposal Finalization: Proposals that meet the required criteria can be finalized, enabling the transfer of funds to vendors.
 - NFT Minting: Supports the minting of different types of NFTs - for donors, voters, and NPOs.
 - Data Retrieval: Various functions to retrieve data like proposal details, vendor details, donation amounts by category, etc.

## Deployed Smartcontracts:
Polygon Mumbai
```
https://mumbai.polygonscan.com/address/0x0b85324695860E65308fbC0f165e0404e8d3b05A
```

Polygon zkEVM Testnet
```
https://testnet-zkevm.polygonscan.com/address/0x14998F14F040A36ABcDB9B771c15f6C23E281c51
```

## Smart Contracts
 - VoteChain.sol - The main contract implementing the core logic of the platform.
 - IVoteChainNFT.sol - Interface defining the structure for NFT contracts to interact with the VoteChain contract.
 - TransferHelper.sol - A helper contract to facilitate secure transfers of tokens.

## Dependencies / Tech
OpenZeppelin Contracts, Solidity, Truffle, ethersjs, mocha, chai


## Setup and Installation
 - Clone the repository to your local machine.
 - Install necessary packages using `npm install`.
 - Compile the contracts using `truffle compile`.
 - Deploy the contracts using `truffle migrate`.

## Events
 - NPOUpdated: Triggered when an NPO's status is updated.
 - DonorUpdated: Triggered when a donor's status is updated.
 - Donated: Triggered when a donation is made.
 - ProposalCreated: Triggered when a new proposal is created.
 - Voted: Triggered when a vote is cast on a proposal.
 - Finalised: Triggered when a proposal is finalized.

## Functions
Below are some of the core functions:

 - donate: For donating to a category.
 - createProposal: For creating a proposal.
 - voteToProposal: For voting on a proposal.
 - finaliseProposal: For finalizing a proposal.

## Testing
To run the tests, use the following command:
```
npm run test
```

## License
This project is licensed under the MIT License.