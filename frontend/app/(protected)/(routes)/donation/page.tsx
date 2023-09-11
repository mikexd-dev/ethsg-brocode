"use client";

import React from "react";
import { createPublicClient, getContract, http } from "viem";
import { polygonMumbai } from "viem/chains";
import vote_chain from "@/blockchain/vote_chain.json";
import { Contract } from "ethers";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { useContractEvent, useContractRead } from "wagmi";

// const transport = http(
//   "https://polygon-mumbai.g.alchemy.com/v2/sO5uKxdgFoY18d1Iee8a8uCNVZTG3zpV"
// );
// const publicClient = createPublicClient({
//   chain: polygonMumbai,
//   transport,
// });

const contractAbi = vote_chain;
const contractAddress = "0x900b6a588ea66f4d9dc108048fff6ad75068296a";
// const contractAddress = "0x6E8457C0C4B2D7eaa2aB1fd6a7379f1251fBD8aC";
const DonationPage = () => {
  const eventNames = [
    "NPOUpdated",
    "DonorUpdated",
    "Donated",
    "ProposalCreated",
    "Voted",
    "Finalised",
  ];

  useContractEvent({
    address: contractAddress,
    abi: contractAbi,
    eventName: "Donated",
    listener: (event) => {
      console.log("Event data:", event);
    },
  });

  const { data, isSuccess, isLoading, refetch } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "npoList",
    // args: ["0x900b6a588ea66f4d9dc108048fff6ad75068296a"],
    // watch: true,
  });
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const contract = new ethers.Contract(contractAddress, ["npoList"], provider);

  //   console.log(data);

  const donate = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    const tx = await contract.donate(
      "animal",
      "0x834abB2d7A935979f704D019fc089DBcE1b914D7",
      ethers.utils.parseUnits("0.1", 18)
    );
    await tx.wait();
  };

  async function getPublicVariables() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    // const npoList = await contract.npoList();
    // console.log("npoList:", npoList);

    const donorList = await contract.donorList(
      "0x87eA8ddFdfB00E07ED8872173e975530D135C9FC"
    );
    console.log("donorList:", donorList);

    const donationAmountByCategory = await contract.donationAmountByCategory();
    console.log("donationAmountByCategory:", donationAmountByCategory);

    const totalProposals = await contract.totalProposals();
    console.log("Total Proposals:", totalProposals);
  }

  return (
    <div>
      <Button onClick={() => donate()}>Donate</Button>
      <Button onClick={() => getPublicVariables()}>Get Public Variables</Button>
    </div>
  );
};

export default DonationPage;
