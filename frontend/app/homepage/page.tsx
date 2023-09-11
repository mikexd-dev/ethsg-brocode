"use client";

import Navbar from "@/components/Homepage/Navbar";
import Sidebar from "@/components/Homepage/Sidebar";
import "./styles.css";
import Funds from "@/components/Homepage/Funds";
import Charities from "@/components/Homepage/Charities";
import ProposalComponent from "@/components/Proposal";
import toast, { Toaster } from "react-hot-toast";
import { useContractEvent, useContractRead, useAccount } from "wagmi";

import vote_chain from "@/blockchain/vote_chain.json";
import dai_token from "@/blockchain/dai_token.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useCustomContractRead } from "@/lib/hooks";
import { useToast } from "@/components/ui/use-toast";

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
    listener: async (event) => {
      toast.loading("Updating funds...");
      console.log("Event data:", event);
      const contract = new ethers.Contract(
        voteChainContractAddress,
        voteChainContractAbi,
        provider
      );
      const animalAmount = await contract.getDonationAmountByCategory(
        "Animals"
      );
      const specialAmount = await contract.getDonationAmountByCategory(
        "Special Needs"
      );
      const familyAmount = await contract.getDonationAmountByCategory("Family");
      const educationAmount = await contract.getDonationAmountByCategory(
        "Education"
      );
      setFunds({
        animals: animalAmount,
        specialNeeds: specialAmount,
        family: familyAmount,
        education: educationAmount,
      });
      toast.remove();
      toast.success("Donation Successful!");
    },
  });

  const [provider, setProvider] = useState<any>(null);
  const [proposalData, setProposalData] = useState<any>(null);
  const [npoData, setNpoData] = useState<any>(null);
  const [funds, setFunds] = useState<any>(null);

  // functions
  const { data: animalAmount }: any = useContractRead({
    address: voteChainContractAddress,
    abi: voteChainContractAbi,
    functionName: "getDonationAmountByCategory",
    args: ["Animals"],
  });

  const { data: specialNeedsAmount }: any = useContractRead({
    address: voteChainContractAddress,
    abi: voteChainContractAbi,
    functionName: "getDonationAmountByCategory",
    args: ["Special Needs"],
  });

  const { data: familyAmount }: any = useContractRead({
    address: voteChainContractAddress,
    abi: voteChainContractAbi,
    functionName: "getDonationAmountByCategory",
    args: ["Family"],
  });

  const { data: educationAmount }: any = useContractRead({
    address: voteChainContractAddress,
    abi: voteChainContractAbi,
    functionName: "getDonationAmountByCategory",
    args: ["Education"],
  });

  useEffect(() => {
    console.log(animalAmount, "animalAmount");
    setFunds({
      animals: animalAmount,
      specialNeeds: specialNeedsAmount,
      family: familyAmount,
      education: educationAmount,
    });
  }, [animalAmount, specialNeedsAmount, familyAmount, educationAmount]);

  console.log(animalAmount, "animalAmount");

  const {
    data: npoInfo,
    isSuccess: isNPOInfoSuccess,
    isLoading: isLoadingNPOInfoSuccess,
    refetch,
  }: any = useContractRead({
    address: voteChainContractAddress,
    abi: voteChainContractAbi,
    functionName: "getNPOInfo",
  });

  useEffect(() => {
    const fetchProposals = async () => {
      if (npoInfo[0].length > 0) {
        await fetchNpo();
      }
    };
    console.log(npoInfo, "npoInfo");
    fetchProposals();
  }, [npoInfo]);

  const fetchNpo = async () => {
    const data: any = [];
    const promises = await npoInfo[1].map(fetchDetails);
    const results = await Promise.all(promises);

    npoInfo[0].map((npo: any, index: any) => {
      results[index].npoid = npo;
      data.push(results[index]);
    });

    setNpoData(data);
  };

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

  console.log(openProposals, "getListOfOpenProposals");

  useEffect(() => {
    const fetchProposals = async () => {
      if (openProposals.length > 0) {
        await fetchProposalDetails();
      }
    };

    fetchProposals();
  }, [openProposals, provider]);

  const fetchProposalData = async (proposal: any) => {
    if (provider) {
      const contract = new ethers.Contract(
        voteChainContractAddress,
        voteChainContractAbi,
        provider
      );
      const proposalUrl = await contract.getProposalData(proposal);
      const proposalDataJson = await fetchDetails(proposalUrl);
      proposalDataJson.proposalId = proposal;
      return proposalDataJson;
    }
  };

  const fetchProposalDetails = async () => {
    const data: any = [];

    const promises = openProposals.map(fetchProposalData);
    const results = await Promise.all(promises);
    results.forEach((result) => data.push(result));

    setProposalData(data);
  };

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

  // end of fetching proposal

  return (
    <div className="bg-[#F5F4F3] h-screen px-12">
      <div>
        <Toaster />
      </div>
      <div className="flex">
        <Navbar />
      </div>
      <div className="mt-4 flex gap-6">
        <div className="flex w-1/4 flex-col">
          <Sidebar openProposals={proposalData} />
        </div>
        <div className="flex w-3/4 flex-col">
          <Funds
            animals={funds && funds.animals}
            specialNeeds={funds && funds.specialNeeds}
            eduction={funds && funds.education}
            family={funds && funds.family}
            voteChainContractAbi={voteChainContractAbi}
            voteChainContractAddress={voteChainContractAddress}
          />
          <Charities
            npo={npoData}
            voteChainContractAddress={voteChainContractAddress}
            voteChainContractAbi={voteChainContractAbi}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
