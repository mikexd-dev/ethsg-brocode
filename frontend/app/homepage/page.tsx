"use client";

import Navbar from "@/components/Homepage/Navbar";
import Sidebar from "@/components/Homepage/Sidebar";
import "./styles.css";
import Funds from "@/components/Homepage/Funds";
import Charities from "@/components/Homepage/Charities";
import ProposalComponent from "@/components/Proposal";

import { useContractEvent, useContractRead, useAccount } from "wagmi";

import vote_chain from "@/blockchain/vote_chain.json";
import dai_token from "@/blockchain/dai_token.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useCustomContractRead } from "@/lib/hooks";

const voteChainContractAbi = vote_chain;
const voteChainContractAddress = "0xbdB220a0B2823E00e27C695346dF1FC2521320Fd";

const daiTokenContractAbi = dai_token;
const daiPayTokenAddress = "0x834abB2d7A935979f704D019fc089DBcE1b914D7";

const Homepage = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const eventNames = [
    "NPOUpdated",
    "DonorUpdated",
    "Donated",
    "ProposalCreated",
    "Voted",
    "Finalised",
  ];

  // event-names
  useContractEvent({
    address: voteChainContractAddress,
    abi: voteChainContractAbi,
    eventName: "Donated",
    listener: (event) => {
      console.log("Event data:", event);
    },
  });

  // functions
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
  const [proposalData, setProposalData] = useState<any>(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  // fetch proposal - start of code
  const {
    data: openProposals,
    isSuccess: isListOpenProposalSuccess,
    isLoading: isLoadingProposalSuccess,
  }: any = useContractRead({
    address: voteChainContractAddress,
    abi: voteChainContractAbi,
    functionName: "getListOfOpenProposals",
  });

  useEffect(() => {
    const fetchDetails = async (proposalUrl: string) => {
      if (proposalUrl) {
        const proposalApiUrl = `api/proposal`;
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proposalUrl }),
        };
        const response = await fetch(proposalApiUrl, requestOptions);

        const data = await response.json();
        return data;
      }
    };

    const fetchProposalDetails = async () => {
      if (openProposals.length > 0) {
        const data: any = [];
        openProposals.map(async (proposal: any) => {
          if (provider) {
            const contract = new ethers.Contract(
              voteChainContractAddress,
              voteChainContractAbi,
              provider
            );
            const proposalUrl = await contract.getProposalData(proposal);
            const proposalDataJson = await fetchDetails(proposalUrl);
            proposalDataJson.proposalId = proposal;
            data.push(proposalDataJson);
          }
        });
        setProposalData(data);
      }
    };

    fetchProposalDetails();
  }, [openProposals, provider]);

  // end of fetching proposal

  return (
    <div className="bg-[#F5F4F3] h-screen px-12">
      <div className="flex">
        <Navbar />
      </div>
      <div className="mt-4 flex gap-6">
        <div className="flex w-1/4 flex-col">
          <Sidebar openProposals={proposalData} />
        </div>
        <div className="flex w-3/4 flex-col">
          <Funds />
          <Charities />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
