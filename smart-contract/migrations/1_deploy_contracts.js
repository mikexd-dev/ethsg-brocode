const VoteChain = artifacts.require("VoteChain");
const VoteChainDonorNFT = artifacts.require("VoteChainDonorNFT");
const VoteChainVoterNFT = artifacts.require("VoteChainVoterNFT");
const VoteChainNPONFT = artifacts.require("VoteChainNPONFT");

module.exports = async function (deployer) {
    // Step 1: Deploy VoteChain contract
    await deployer.deploy(VoteChain);
    const voteChainInstance = await VoteChain.deployed();

    // Step 2: Deploy VoteChainDonorNFT and update VoteChain with its address
    // await deployer.deploy(VoteChainDonorNFT);
    // const voteChainDonorNFTInstance = await VoteChainDonorNFT.deployed();
    // await voteChainInstance.updateDonorNFT(voteChainDonorNFTInstance.address);

    // Step 3: Deploy VoteChainVoterNFT and update VoteChain with its address
    // await deployer.deploy(VoteChainVoterNFT);
    // const voteChainVoterNFTInstance = await VoteChainVoterNFT.deployed();
    // await voteChainInstance.updateVoterNFT(voteChainVoterNFTInstance.address);

    // Step 4: Deploy VoteChainNPONFT and update VoteChain with its address
    // await deployer.deploy(VoteChainNPONFT);
    // const voteChainNPONFTInstance = await VoteChainNPONFT.deployed();
    // await voteChainInstance.updateNPONFT(voteChainNPONFTInstance.address);

    // Step 5: Update Allowlist in voteChainDonorNFTInstance, voteChainVoterNFTInstance, voteChainNPONFTInstance
    // await voteChainDonorNFTInstance.updateAllowedList(voteChainInstance.address, true);
    // await voteChainVoterNFTInstance.updateAllowedList(voteChainInstance.address, true);
    // await voteChainNPONFTInstance.updateAllowedList(voteChainInstance.address, true);
};
