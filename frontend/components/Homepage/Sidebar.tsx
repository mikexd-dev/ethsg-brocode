import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import ProposalPopup from "../Proposal";
import { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";

const Sidebar = ({
  openProposals,
  voteChainContractAbi,
  voteChainContractAddress,
}: any) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const showProposal = (index: number) => {
    setSelectedProposal(openProposals[index]);
    setShowPopup(true);
  };

  if (openProposals == null) {
    openProposals = [];
  }

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="show"
        variants={fadeIn("right", "spring", 1 * 0.5, 0.75)}
        className={`transition-[flex] duration-[0.7s] ease-out-flex cursor-pointer bg-[#1F2937] p-4 rounded-lg`}
      >
        {/* <div className=""> */}
        <h3 className="font-semibold text-white mb-2">How it works</h3>
        <p className="text-white">
          Checkout this short 3 minutes video to get started and make an impact.
        </p>
        <img
          src="https://nyckidsrise.org/wp-content/uploads/2021/08/olmos_NYC-kids-RISE-8530_1920x1200.jpg"
          className="rounded mt-4 object-contain"
        />
        {/* </div> */}
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        variants={fadeIn("right", "spring", 1 * 0.5, 0.75)}
        className="bg-[#E5E7EB] p-4 rounded-lg mt-4 overflow-y-scroll max-h-[600px]"
      >
        <p className="font-semibold">
          Open Proposals{" "}
          <span className="ml-1 font-normal text-sm text-white bg-[#9CA3AF] px-2 py-1 rounded-full">
            {openProposals.length}
          </span>
        </p>

        {openProposals != null &&
          openProposals.map((proposal: any, index: number) => {
            if (proposal !== undefined) {
              return (
                <>
                  <div
                    className="bg-white rounded-lg p-4 my-4"
                    onClick={() => showProposal(index)}
                  >
                    <p className="font-semibold">{proposal.title}</p>
                    <span
                      className={`tag ${
                        proposal.impact.subject === "Animals"
                          ? "tagBlue"
                          : proposal.impact.subject === "Special Needs"
                          ? "tagRed"
                          : proposal.impact.subject === "Education"
                          ? "tagGreen"
                          : proposal.impact.subject === "Families"
                          ? "tagYellow"
                          : ""
                      }`}
                    >
                      {proposal.impact.subject}
                    </span>
                    <p className="mt-4 mb-4 flex items-center text-sm">
                      <img
                        src="https://www.mintface.xyz/content/images/2021/08/QmTndiF423kjdXsNzsip1QQkBQqDuzDhJnGuJAXtv4XXiZ-1.png"
                        className="w-[40px] rounded-full mr-2"
                      ></img>
                      Habitat for Humanity
                    </p>
                    <div className="flex justify-between w-full items-center">
                      <p className="text-gray-800">{proposal.vendor.amount}</p>
                    </div>
                  </div>
                </>
              );
            } else {
              <div>loading...</div>;
            }
          })}
      </motion.div>

      {showPopup && selectedProposal ? (
        <ProposalPopup
          proposal={selectedProposal}
          open={showPopup}
          setOpen={setShowPopup}
          voteChainContractAbi={voteChainContractAbi}
          voteChainContractAddress={voteChainContractAddress}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Sidebar;
