const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');
const ether = require('@openzeppelin/test-helpers/src/ether');

const VoteChain = contract.fromArtifact('VoteChain');
const VoteChainDonorNFT = contract.fromArtifact('VoteChainDonorNFT');
const VoteChainVoterNFT = contract.fromArtifact('VoteChainVoterNFT');
const VoteChainNPONFT = contract.fromArtifact('VoteChainNPONFT');
const TestERC20 = contract.fromArtifact("TestERC20");

describe('VoteChain', async function () {
    this.timeout(60000); // set the timeout to 10 seconds

    const [owner, npo1, npo2, donor1, donor2, donor3, vendor1, vendor2, vendor3] = accounts;
    const ZERO_ADDRESS = '0x0';
    let token1, token2, token3, token4, token5;
    const category1 = "animal";
    const category2 = "children";
    const invoice = "https://pin.ski/489u5EA"
    const proposalData = "https://api.jsonserve.com/NEAUsw"
    const npoData = "https://api.jsonserve.com/kVRJGk"

    let halfETH = ether('0.5');
    let oneETH = ether('1');
    let twoETH = ether('2');
    let fiveETH = ether('5');
    let tenETH = ether('10');
    let twentyETH = ether('20');
    let sixtyETH = ether('60');
    let hundredETH = ether('100');
    let thousandETH = ether('1000');

    let futureTimeStamp = Math.floor(Date.now() / 1000) + 1000;

    beforeEach(async function () {
        this.VoteChain = await VoteChain.new({ from: owner });
        expect(this.VoteChain.address).to.not.equal(null);

        token1 = await TestERC20.new("DAI", "DAI", { from: owner });
        expect(token1.address).to.not.equal(null);
        await token1.mint(donor1, thousandETH, { from: owner });

        this.VoteChainDonorNFT = await VoteChainDonorNFT.new({ from: owner });
        expect(this.VoteChainDonorNFT.address).to.not.equal(null);

        this.VoteChainVoterNFT = await VoteChainVoterNFT.new({ from: owner });
        expect(this.VoteChainVoterNFT.address).to.not.equal(null);

        this.VoteChainNPONFT = await VoteChainNPONFT.new({ from: owner });
        expect(this.VoteChainNPONFT.address).to.not.equal(null);

        await this.VoteChain.updateDonorNFT(this.VoteChainDonorNFT.address, { from: owner });
        await this.VoteChain.updateVoterNFT(this.VoteChainVoterNFT.address, { from: owner });
        await this.VoteChain.updateNPONFT(this.VoteChainNPONFT.address, { from: owner });

        await this.VoteChainDonorNFT.updateAllowedList(this.VoteChain.address, true, { from: owner })
        await this.VoteChainVoterNFT.updateAllowedList(this.VoteChain.address, true, { from: owner })
        await this.VoteChainNPONFT.updateAllowedList(this.VoteChain.address, true, { from: owner })
    });

    describe('NPO', async function () {
        it('should update NPO Status to true', async function () {
            await this.VoteChain.updateNPO(npo1, true, npoData, { from: owner });
            expect(await this.VoteChain.getNPOStatus(npo1)).to.equal(true);
        });

        it('should update NPO Status to false', async function () {
            await this.VoteChain.updateNPO(npo1, false, npoData, { from: owner });
            expect(await this.VoteChain.getNPOStatus(npo1)).to.equal(false);
        });
    });

    describe('Donor', async function () {
        it('should allow user to donate DAI', async function () {
            await token1.approve(this.VoteChain.address, hundredETH, { from: donor1 });
            await this.VoteChain.donate(category1, token1.address, hundredETH, { from: donor1 });
            const contractBalance = await token1.balanceOf(this.VoteChain.address);
            expect(await token1.balanceOf(this.VoteChain.address)).to.be.bignumber.equal(contractBalance.toString());
        });
    });

    describe('End to End', async function () {

        it('End to End Test', async function () {

            // Create NPO
            await this.VoteChain.updateNPO(npo1, true, npoData, { from: owner });
            expect(await this.VoteChain.getNPOStatus(npo1)).to.equal(true);

            // Donate
            await token1.approve(this.VoteChain.address, hundredETH, { from: donor1 });
            await this.VoteChain.donate(category1, token1.address, hundredETH, { from: donor1 });

            await token1.mint(donor2, thousandETH, { from: donor2 });
            await token1.approve(this.VoteChain.address, hundredETH, { from: donor2 });
            await this.VoteChain.donate(category1, token1.address, hundredETH, { from: donor2 });

            await token1.mint(donor3, thousandETH, { from: donor3 });
            await token1.approve(this.VoteChain.address, hundredETH, { from: donor3 });
            await this.VoteChain.donate(category1, token1.address, hundredETH, { from: donor3 });

            // Create Proposal
            const createProposalTx = await this.VoteChain.createProposal(category1, [vendor1, vendor2, vendor3], [tenETH.toString(), tenETH.toString(), tenETH.toString()], invoice, token1.address, proposalData, { from: npo1 });
            const proposalId = createProposalTx.logs[0].args.proposalId;

            // Vote Proposal - Donor 1
            await this.VoteChain.voteToProposal(proposalId, true, { from: donor1 });

            // Vote Proposal - Donor 2
            await this.VoteChain.voteToProposal(proposalId, true, { from: donor2 });

            // Vote Proposal - Donor 2
            await this.VoteChain.voteToProposal(proposalId, false, { from: donor3 });

            // Finalise Proposal
            await this.VoteChain.finaliseProposal(proposalId, { from: npo1 });

            // Check if Approved or Not
            await this.VoteChain.isProposalApproved(proposalId);
            expect(await this.VoteChain.isProposalApproved(proposalId)).to.equal(true);
        });
    });
});
