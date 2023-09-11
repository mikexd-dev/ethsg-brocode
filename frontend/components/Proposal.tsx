"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";

const ProposalPopup = (props: any) => {
  const proposal = props.proposal;
  const { voteChainContractAbi, voteChainContractAddress } = props;
  console.log(proposal, "proposal");

  const [provider, setProvider] = useState<any>(null);
  const { address, isConnecting, isDisconnected } = useAccount();
  const [isVoted, setIsVoted] = useState<any>(false);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  const vote = async () => {
    toast.loading("Waiting for txn...");
    console.log(proposal, "proposal");

    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      voteChainContractAddress,
      voteChainContractAbi,
      signer
    );
    // const tx = await contract.getVendorAmountsForPorposal(proposal.proposalId);
    const tx = await contract.voteToProposal(proposal.proposalId);
    await tx.wait();
    setIsVoted(true);
    console.log(tx, "tx");
    toast.remove();
  };

  const { data }: any = useContractRead({
    address: voteChainContractAddress,
    abi: voteChainContractAbi,
    functionName: "getVendorAmountsForPorposal",
    args: [proposal.proposalId],
  });

  // console.log(ethers.utils.formatEther(data[0]), "aount");

  // const isAlreadyApproved = async () => {
  //   const signer = provider.getSigner();
  //   const contract = new ethers.Contract(
  //     voteChainContractAddress,
  //     voteChainContractAbi,
  //     signer
  //   );
  //   const tx = await contract.trackUniqueDonor(proposal.category, address);
  //   await tx.wait();
  //   return tx;
  // };

  if (proposal.title == "") return <></>;

  return (
    <>
      <Dialog open={props.open} onOpenChange={props.setOpen}>
        <DialogContent className="max-w-[800px] bg-gray-100 pt-12">
          <DialogHeader className="flex flex-row gap-5">
            <div className="flex flex-col w-2/3">
              <DialogTitle>{proposal.title}</DialogTitle>
              <div className="flex flex-row items-center gap-2 pt-3 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <DialogDescription className="text-sm text-gray-800">
                  {proposal.npo}
                </DialogDescription>
              </div>
              <img
                src="/howtovote.svg"
                alt="howtovote"
                className="py-2 w-full"
              />
            </div>
            <div className="flex flex-col overflow-hidden rounded-lg w-1/3">
              <div className="bg-white p-2">
                <div className="flex flex-row items-center justify-between mb-2">
                  <div className="text-gray-400 text-xs">ASK</div>
                  <div className="text-gray-800 font-semibold">
                    {proposal?.vendor?.amount}
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between mb-4">
                  <div className="text-gray-400 text-xs">FROM</div>
                  <div className="flex flex-row items-center gap-1">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="text-gray-800 font-semibold text-sm">
                      {proposal.category}
                    </div>
                  </div>
                </div>
                {/* TODO: */}
                {isVoted ? (
                  <div className="text-center p-3 text-sm text-green-600">
                    You have voted, stay tuned for the results!
                  </div>
                ) : (
                  <div className="flex flex-row gap-2 justify-between py-2">
                    <Button
                      variant="default"
                      className="bg-green-500 py-0 w-1/2"
                      size="sm"
                      onClick={vote}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="py-0 w-1/2"
                      size="sm"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
              <div className="bg-gray-200 text-center p-2 rounded-b text-gray-500 text-xs">
                3 days left
              </div>
            </div>
          </DialogHeader>
          <DialogDescription className="border border-[1] rounded-md p-4">
            <div className="mb-6">
              <DialogDescription className="text-sm font-semibold text-gray-800 pb-2">
                Description
              </DialogDescription>
              <DialogDescription className="text-sm text-gray-800">
                {proposal.description}
              </DialogDescription>
            </div>

            <div className="mb-6">
              <DialogDescription className="text-sm font-semibold text-gray-800 pb-2">
                Why we need this
              </DialogDescription>
              <DialogDescription className="text-sm text-gray-800">
                {proposal.rationale}
              </DialogDescription>
            </div>

            <div className="mb-6">
              <DialogDescription className="text-sm font-semibold text-gray-800 pb-2">
                Estimated Impact
              </DialogDescription>
              <div className="bg-gray-200 rounded p-2 w-1/4">
                <DialogDescription className="text-4xl font-semibold text-gray-800 pb-5">
                  {proposal.impact.quantity}
                </DialogDescription>
                <DialogDescription className="text-sm text-gray-800">
                  {proposal.impact.subject}
                </DialogDescription>
              </div>
            </div>

            <DialogDescription className="text-sm font-semibold text-gray-800 pb-2">
              Vendor
            </DialogDescription>
            <div className="bg-white p-4 rounded-lg">
              <div className="flex flex-row justify-between pb-2">
                <div className="flex flex-row items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="text-gray-800 font-semibold text-md">
                    {proposal.vendor.name}
                  </div>
                </div>
                <div className="text-gray-800 font-semibold text-xl">
                  {proposal.vendor.amount}
                </div>
              </div>
              <DialogDescription className="text-sm text-gray-400 pb-2">
                {proposal.vendor.docs}
              </DialogDescription>
              <DialogDescription className="text-sm text-gray-800">
                {proposal.vendor.description}
              </DialogDescription>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProposalPopup;
