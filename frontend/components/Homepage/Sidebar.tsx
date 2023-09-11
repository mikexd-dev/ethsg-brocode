import {
  Dialog,
} from "@/components/ui/dialog"
import { DialogContent } from "@radix-ui/react-dialog";
import ProposalPopup from "../Proposal";

const Sidebar = ({ openProposals }: any) => {

  console.log(openProposals, "openProposals 123");
  const showPopup = true

  const PROPOSAL = {
    title: "Furniture for 40 families in need",
    npo: "Habitat for Humanity",
    description:
      "Asking for funds to get required furniture for 40 families in need",
    rationale:
      "These families have been living in poor conditions for a long period of time. These funds will go a long way to improve their living conditions",
    impact: {
      subject: "Families",
      quantity: 100,
    },
    category: "Family",
    vendor: {
      name: "Vendor Name",
      description:
        "Furni-sure is an establised furniture store that has been around for more than 10 years. They obtain good condition 2nd had furniture and sell them at affordable prices",
      docs: "2 attached docs",
      amount: "$4200",
    },
    timeLeft: "2 days left",
    ask: "$4200",
  };

  return <>
    <div className="bg-[#1F2937] p-4 rounded-lg">
      <h3 className="font-semibold text-white mb-2">How it works</h3>
      <p className="text-white">Checkout this short 3 minutes video to get started and make an impact.</p>
      <img src="https://nyckidsrise.org/wp-content/uploads/2021/08/olmos_NYC-kids-RISE-8530_1920x1200.jpg" className="rounded mt-4 object-contain" />
    </div>

    <div className="bg-[#E5E7EB] p-4 rounded-lg mt-4">
      <p className="font-semibold">Open Proposals <span className="ml-1 font-normal text-sm text-white bg-[#9CA3AF] px-2 py-1 rounded-full">3</span></p>

      <div className="bg-white rounded-lg p-4 my-4">
        <p className="font-semibold">Furniture for 40 families in need</p>
        <span className="tag tagBlue">Family</span>
        <p className="mt-4 mb-4 flex items-center text-sm"><img src="https://www.mintface.xyz/content/images/2021/08/QmTndiF423kjdXsNzsip1QQkBQqDuzDhJnGuJAXtv4XXiZ-1.png" className="w-[40px] rounded-full mr-2"></img> Habitat for Humanity</p>
        <div className="flex justify-between w-full items-center">
          <p className="text-gray-800">$4,200</p>
          <p className="text-xs text-gray-400">3 days left</p>
        </div>
      </div>
    </div>

    {
      showPopup ? <ProposalPopup proposal={PROPOSAL} /> : <></>
    }
  </>
  );
};

export default Sidebar;
