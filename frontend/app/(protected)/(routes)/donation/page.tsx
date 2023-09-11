"use client";

import React, { useEffect, useState } from "react";
import { createPublicClient, getContract, http } from "viem";
import { polygonMumbai } from "viem/chains";

import { Contract } from "ethers";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { useContractEvent, useContractRead, useAccount } from "wagmi";

import vote_chain from "@/blockchain/vote_chain.json";
import dai_token from "@/blockchain/dai_token.json";

// const transport = http(
//   "https://polygon-mumbai.g.alchemy.com/v2/sO5uKxdgFoY18d1Iee8a8uCNVZTG3zpV"
// );
// const publicClient = createPublicClient({
//   chain: polygonMumbai,
//   transport,
// });

const voteChainContractAbi = vote_chain;
const voteChainContractAddress = "0xbdB220a0B2823E00e27C695346dF1FC2521320Fd";

const daiTokenContractAbi = dai_token;
const daiPayTokenAddress = "0xE1FD11Eb2D3b2eaa80E5F6db10374AA71Fe2C55C";

const DonationPage = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const eventNames = [
    "NPOUpdated",
    "DonorUpdated",
    "Donated",
    "ProposalCreated",
    "Voted",
    "Finalised",
  ];

  useContractEvent({
    address: voteChainContractAddress,
    abi: voteChainContractAbi,
    eventName: "Donated",
    listener: (event) => {
      console.log("Event data:", event);
    },
  });

  const {
    data: openProposals,
    isSuccess: isListOpenProposalSuccess,
    isLoading: isLoadingProposalSuccess,
  } = useContractRead({
    address: voteChainContractAddress,
    abi: voteChainContractAbi,
    functionName: "getListOfOpenProposals",
  });

  const {
    data: npoInfo,
    isSuccess: isNPOInfoSuccess,
    isLoading: isLoadingNPOInfoSuccess,
    refetch,
  } = useContractRead({
    address: voteChainContractAddress,
    abi: voteChainContractAbi,
    functionName: "getNPOInfo",
  });

  const [provider, setProvider] = useState<any>(null);
  const [isApproved, setIsApproved] = useState<any>(false);
  const [isDonated, setIsDonated] = useState<any>(false);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  console.log(openProposals, "getListOfOpenProposals");
  console.log(npoInfo, "getNPOInfo");

  const donate = async () => {
    const amountToDonate = ethers.utils.parseUnits("0.1", 18).toString();
    console.log(amountToDonate, "amountToDonate");
    const valueApproved = await isAlreadyApproved();
    console.log(parseFloat(amountToDonate), parseFloat(valueApproved));
    if (parseFloat(amountToDonate) > parseFloat(valueApproved)) {
      console.log("approve");
      await checkAndSetAllowance(amountToDonate);
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      voteChainContractAddress,
      voteChainContractAbi,
      signer
    );
    const tx = await contract.donate(
      "Animals",
      daiPayTokenAddress,
      ethers.utils.parseUnits("0.1", 18)
    );
    await tx.wait();
  };

  const approve = async () => {
    console.log("1");
    const signer = provider.getSigner();
    console.log("2");
    const contract = new ethers.Contract(
      daiPayTokenAddress,
      daiTokenContractAbi,
      signer
    );
    console.log("3");
    const maxUint = ethers.constants.MaxUint256;
    console.log("4");
    const tx = await contract.allowance(daiTokenContractAbi, maxUint);
    await tx.wait();
  };

  const checkAndSetAllowance = async (amount: any) => {
    // Transactions with the native token don't need approval
    // if (tokenAddress === ethers.constants.AddressZero) {
    //   return;
    // }

    const erc20 = new Contract(
      daiPayTokenAddress,
      daiTokenContractAbi,
      provider.getSigner()
    );
    const allowance = await erc20.allowance(address, voteChainContractAddress);
    console.log("allowance:", allowance.toString(), amount);
    if (allowance.lt(amount)) {
      const approveTx = await erc20.approve(voteChainContractAddress, amount);
      try {
        await approveTx.wait();
        console.log(`Transaction mined succesfully: ${approveTx.hash}`);
      } catch (error) {
        console.log(`Transaction failed with error: ${error}`);
      }
    }
  };

  const isAlreadyApproved = async () => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      daiPayTokenAddress,
      daiTokenContractAbi,
      signer
    );
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const allowedSpend = await contract.allowance(
      accounts[0],
      daiPayTokenAddress
    );
    console.log("allowedSpend:", allowedSpend.toString());
    return allowedSpend;
  };

  useEffect(() => {
    isAlreadyApproved();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {/* {!isApproved && <Button onClick={() => setLimit()}>Approve Limit</Button>} */}
      {!isDonated && <Button onClick={() => donate()}>Donate</Button>}
    </div>
  );
};

export default DonationPage;
