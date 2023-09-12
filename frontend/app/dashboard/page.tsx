"use client";

import Navbar from "@/components/Homepage/Navbar";
import Sidebar from "@/components/Homepage/Sidebar";
import "./styles.css";
import Funds from "@/components/Homepage/Funds";
import Charities from "@/components/Homepage/Charities";
import ProposalComponent from "@/components/Proposal";
import toast, { Toaster } from "react-hot-toast";
import {
  useContractEvent,
  useContractRead,
  useAccount,
  useChainId,
} from "wagmi";

import vote_chain from "@/blockchain/vote_chain.json";
import vote_chain_zkevm from "@/blockchain/vote_chain_zkevm.json";
import dai_token from "@/blockchain/dai_token.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useCustomContractRead } from "@/lib/hooks";
import { useToast } from "@/components/ui/use-toast";
import { fadeIn } from "@/lib/motion";
import { motion } from "framer-motion";
import ConfettiExplosion from "react-confetti-explosion";
import { useRouter } from "next/router";

const polygonVoteChainContractAbi = vote_chain;
const zkEvmVoteChainContractAbi = vote_chain;
const polygonVoteChainContractAddress =
  "0x0b85324695860E65308fbC0f165e0404e8d3b05A";
const zkEvmVoteChainContractAddress =
  "0x14998F14F040A36ABcDB9B771c15f6C23E281c51";

const polygonDaiTokenContractAbi = dai_token;
const polygonDaiPayTokenAddress = "0xE1FD11Eb2D3b2eaa80E5F6db10374AA71Fe2C55C";

// TODO
const zkEvmDaiTokenContractAbi = dai_token;
const zkEvmDaiPayTokenAddress = "0xE1FD11Eb2D3b2eaa80E5F6db10374AA71Fe2C55C";

const Homepage = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  console.log(useChainId(), "useChainId()");
  const [isExploding, setIsExploding] = useState(false);
  const [voteChainContractAddress, setVoteChainContractAddress] = useState<any>(
    polygonVoteChainContractAbi
  );
  const [voteChainContractAbi, setVoteChainContractAbi] = useState<any>(
    polygonVoteChainContractAbi
  );
  const [daiTokenContractAddress, setDaiTokenContractAddress] = useState<any>(
    polygonDaiPayTokenAddress
  );
  const [daiTokenContractAbi, setDaiTokenContractAbi] = useState<any>(
    polygonDaiTokenContractAbi
  );

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  const chainId = useChainId();

  useEffect(() => {
    if (chainId === 80001) {
      setVoteChainContractAddress(polygonVoteChainContractAddress);
      setVoteChainContractAbi(polygonVoteChainContractAbi);
      setDaiTokenContractAbi(polygonDaiTokenContractAbi);
      setDaiTokenContractAddress(polygonDaiPayTokenAddress);
    }
    if (chainId === 1442) {
      setVoteChainContractAddress(zkEvmVoteChainContractAddress);
      setVoteChainContractAbi(zkEvmVoteChainContractAbi);
      setDaiTokenContractAbi(zkEvmDaiTokenContractAbi);
      setDaiTokenContractAddress(zkEvmDaiPayTokenAddress);
    }
  }, [chainId]);

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
    eventName: "Voted",
    listener: async (event) => {
      setIsExploding(false);
      toast.loading("Updating Votes...");
      console.log("Event data:", event);
      //   const contract = new ethers.Contract(
      //     voteChainContractAddress,
      //     voteChainContractAbi,
      //     provider
      //   );
      toast.remove();
      toast.success("Voting Successful!");
      setIsExploding(true);
    },
  });

  const [provider, setProvider] = useState<any>(null);
  const [proposalData, setProposalData] = useState<any>(null);
  const [npoData, setNpoData] = useState<any>(null);
  const [funds, setFunds] = useState<any>(null);
  const [isDonated, setIsDonated] = useState<any>(false);

  // useContractEvent({
  //   address: voteChainContractAddress,
  //   abi: voteChainContractAbi,
  //   eventName: "Donated",
  //   listener: async (event) => {
  //     setTimeout(async () => {
  //       setIsExploding(false);
  //       toast.loading("Updating funds...");
  //       console.log("Event data:", event);
  //       await fetchFunds();
  //       toast.remove();
  //       toast.success("Donation Successful!");
  //       setIsExploding(true);
  //     }, 1500);
  //   },
  // });

  const invokeSuccessDonation = async () => {
    setIsExploding(false);
    toast.loading("Updating funds...");
    await fetchFunds();
    toast.remove();
    toast.success("Donation Successful!");
    setIsExploding(true);
  };

  const fetchFunds = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      voteChainContractAddress,
      voteChainContractAbi,
      provider
    );
    const animalAmount = await contract.getDonationAmountByCategory("Animals");
    const specialAmount = await contract.getDonationAmountByCategory(
      "Special Needs"
    );
    const familyAmount = await contract.getDonationAmountByCategory("Family");
    const educationAmount = await contract.getDonationAmountByCategory(
      "Education"
    );
    console.log(
      ethers.utils.formatEther(animalAmount),
      "animalAmount",
      ethers.utils.formatEther(specialAmount),
      "specialAmount",
      ethers.utils.formatEther(familyAmount),
      "familyAmount",
      ethers.utils.formatEther(educationAmount),
      "educationAmount",
      "mike here"
    );
    const tempFunds = {
      animals: animalAmount,
      specialNeeds: specialAmount,
      family: familyAmount,
      education: educationAmount,
    };
    setFunds({ ...tempFunds });
  };

  useEffect(() => {
    fetchFunds();
  }, [chainId, provider, setIsDonated]);

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
      {/* <div className="h-screen flex justify-center items-center"></div> */}

      <div className="flex">
        <Navbar />
      </div>
      <div className="mt-4 flex gap-6">
        <div className="flex w-1/4 flex-col">
          <Sidebar
            openProposals={proposalData}
            voteChainContractAbi={voteChainContractAbi}
            voteChainContractAddress={voteChainContractAddress}
          />
        </div>

        <div className="flex w-3/4 flex-col">
          {isExploding && <ConfettiExplosion />}
          <Funds
            animals={funds && funds.animals}
            specialNeeds={funds && funds.specialNeeds}
            education={funds && funds.education}
            family={funds && funds.family}
            voteChainContractAbi={voteChainContractAbi}
            voteChainContractAddress={voteChainContractAddress}
            invokeSuccessDonation={invokeSuccessDonation}
            daiPayTokenAddress={daiTokenContractAddress}
            daiTokenContractAbi={daiTokenContractAbi}
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
