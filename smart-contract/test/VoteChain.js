const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');
const { expectRevert, expectEvent, time } = require('@openzeppelin/test-helpers');
const ether = require('@openzeppelin/test-helpers/src/ether');

const VoteChain = contract.fromArtifact('VoteChain');
const VoteChainDonorNFT = contract.fromArtifact('VoteChainDonorNFT');
const VoteChainVoterNFT = contract.fromArtifact('VoteChainVoterNFT');
const TestERC20 = contract.fromArtifact("TestERC20");

const { web3 } = require('@openzeppelin/test-helpers/src/setup');

async function increaseTime(seconds) {
    await web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [seconds],
        id: new Date().getTime()
    });
}

async function mineBlock() {
    await web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: new Date().getTime()
    });
}

describe('VoteChain', async function () {
    this.timeout(60000); // set the timeout to 10 seconds

    const [owner, npo1, npo2, maker, donor1, donor2, donor3, donor4, donor5] = accounts;
    const ZERO_ADDRESS = '0x0';
    let token1, token2, token3, token4, token5;
    const category1 = "animal";
    const category2 = "children";

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

        await this.VoteChain.updateDonorNFT(this.VoteChainDonorNFT.address, { from: owner });
        await this.VoteChainDonorNFT.updateAllowedList(this.VoteChain.address, true, { from: owner })

        this.VoteChainVoterNFT = await VoteChainVoterNFT.new({ from: owner });
        expect(this.VoteChainVoterNFT.address).to.not.equal(null);

        await this.VoteChain.updateDonorNFT(this.VoteChainVoterNFT.address, { from: owner });
        await this.VoteChainVoterNFT.updateAllowedList(this.VoteChain.address, true, { from: owner })

        await this.VoteChainDonorNFT.allowMint(this.VoteChain.address, { from: owner });
        await this.VoteChainVoterNFT.allowMint(this.VoteChain.address, { from: owner });
    });

    describe('NPO', async function () {
        it('should update NPO Status to true', async function () {
            await this.VoteChain.updateNPO(npo1, true, { from: owner });
            expect(await this.VoteChain.getNPOStatus(npo1)).to.equal(true);
        });

        it('should update NPO Status to false', async function () {
            await this.VoteChain.updateNPO(npo1, false, { from: owner });
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

});
