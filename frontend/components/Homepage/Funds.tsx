"use client";

import dai_token from "@/blockchain/dai_token.json";
import { ethers, Contract } from "ethers";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

const Funds = ({
  animals,
  specialNeeds,
  family,
  education,
  voteChainContractAddress,
  voteChainContractAbi,
}: any) => {
  const FundsArray = [
    {
      id: "1",
      name: "Animals",
      image:
        "https://images.pexels.com/photos/15175668/pexels-photo-15175668/free-photo-of-a-black-dog-in-close-up-shot.jpeg",
      bytes32:
        "0x2ea975709bff84e46009afad424470760eeddd15908236dc585ac043ada98c8e",
      amount: animals,
    },
    {
      id: "2",
      name: "Special Needs",
      image: "https://images.pexels.com/photos/339619/pexels-photo-339619.jpeg",
      bytes32:
        "0xc3e11e7a6567cc2e6ea1824d22a33f503781f8dc9094ee008bb4030e094f091d",
      amount: specialNeeds,
    },
    {
      id: "3",
      name: "Family",
      image:
        "https://images.pexels.com/photos/7983157/pexels-photo-7983157.jpeg",
      bytes32:
        "0xcdd78f062154f618fa9e2c7e443110cc61eaad907c91236f9e752b62b2bad605",
      amount: family,
    },
    {
      id: "4",
      name: "Education",
      image:
        "https://images.pexels.com/photos/1720188/pexels-photo-1720188.jpeg",
      bytes32:
        "0x6377c45cecbe1f20eaf46bd3f27ae079882e88d579f5eed558666cd6bfd75606",
      amount: education,
    },
  ];

  const [funds, setFunds] = useState<any>(FundsArray);
  const [donationAmount, setDonationAmount] = useState<any>(0);

  const daiTokenContractAbi = dai_token;
  const daiPayTokenAddress = "0xE1FD11Eb2D3b2eaa80E5F6db10374AA71Fe2C55C";

  const [provider, setProvider] = useState<any>(null);
  const { address, isConnecting, isDisconnected } = useAccount();

  console.log(animals, "animals");

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  useEffect(() => {
    const tempFunds = funds;
    tempFunds[0].amount = animals && ethers.utils.formatEther(animals);
    tempFunds[1].amount =
      specialNeeds && ethers.utils.formatEther(specialNeeds);
    tempFunds[2].amount = family && ethers.utils.formatEther(family);
    tempFunds[3].amount = education && ethers.utils.formatEther(education);

    setFunds(tempFunds);
  }, [animals, specialNeeds, family, education]);

  const checkAndSetAllowance = async (amount: any) => {
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

  const donate = async (fund: any) => {
    toast.loading("Waiting for txn...");
    console.log(fund, "fund");
    const amountToDonate = ethers.utils
      .parseUnits(donationAmount?.target?.value, 18)
      .toString();
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
      fund.name,
      daiPayTokenAddress,
      ethers.utils.parseUnits(donationAmount?.target?.value, 18)
    );
    await tx.wait();
    toast.remove();
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
    <>
      <div className="w-full">
        <h1 className="text-3xl font-semibold mb-4">Funds</h1>

        <div className="flex gap-4 w-full">
          {funds.map((fund: any, index: any) => {
            return (
              <>
                <div
                  key={`Funds-${index}-${fund.id}`}
                  className="bg-white rounded-lg p-4 w-1/4"
                >
                  <p className="flex items-center font-semibold">
                    <img
                      className="w-[60px] h-[60px] object-cover rounded-sm mr-2"
                      src={fund.image}
                    ></img>
                    {fund.name}
                  </p>

                  <div className="flex mt-12 items-center justify-between">
                    <p className="text-2xl font-semibold text-gray-800">
                      {fund.amount || 0} DAI
                    </p>
                    <Popover>
                      <PopoverTrigger>
                        <button className="bg-slate-900 p-2 text-white rounded-lg px-4">
                          Donate
                        </button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                          <Input
                            type="number"
                            onChange={(value) => setDonationAmount(value)}
                          />
                          <Button type="submit" onClick={() => donate(fund)}>
                            Donate
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Funds;
