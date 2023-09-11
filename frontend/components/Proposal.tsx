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
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
const ProposalPopup = () => {
  const {
    title,
    npo,
    description,
    rationale,
    impact,
    vendor,
    timeLeft,
    ask,
    category,
  } = PROPOSAL;
  const color = "#0F172A";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Proposal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-slate-50">
        <DialogHeader className="flex flex-row gap-5">
          <div className="flex flex-col flex-[1.5]">
            <DialogTitle>{title}</DialogTitle>
            <div className="flex flex-row items-center gap-2 pt-3">
              <Avatar className="h-5 w-5">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <DialogDescription className="text-xs">{npo}</DialogDescription>
            </div>
            <Image
              src="/howtovote.svg"
              alt="howtovote"
              width={250}
              height={50}
              className="py-2"
            />
          </div>
          <div className="flex-1 rounded-lg">
            <div className="bg-white  p-2">
              <div className="flex flex-row justify-between">
                <div className="text-gray-400 text-xs">ASK</div>
                <div className="text-gray-800 font-semibold">{ask}</div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="text-gray-400 text-xs">FROM</div>
                <div className="flex flex-row items-center gap-1">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="text-gray-800 font-semibold text-sm">
                    {category}
                  </div>
                </div>
              </div>
              {/* TODO: */}
              <div className="flex flex-row gap-2 justify-between py-2">
                <Button
                  variant="default"
                  className="bg-green-500 py-0"
                  size="sm"
                >
                  Approve
                </Button>
                <Button variant="destructive" className="py-0" size="sm">
                  Reject
                </Button>
              </div>
            </div>
            <div className="bg-gray-200 text-center p-2 rounded-b text-gray-500 text-xs">
              3 days left
            </div>
          </div>
        </DialogHeader>
        <DialogDescription className="border border-[1] rounded-md">
          <div className="p-4 pb-2">
            <DialogDescription className="text-xs font-semibold text-gray-800 pb-2">
              Description
            </DialogDescription>
            <DialogDescription className="text-xs text-gray-800">
              {description}
            </DialogDescription>
          </div>
          <div className="p-4 pb-2">
            <DialogDescription className="text-xs font-semibold text-gray-800 pb-2">
              Why we need this
            </DialogDescription>
            <DialogDescription className="text-xs text-gray-800">
              {rationale}
            </DialogDescription>
          </div>

          <div className="p-4 pb-2 w-[50%] mb-2">
            <DialogDescription className="text-xs font-semibold text-gray-800 pb-2">
              Estimated Impact
            </DialogDescription>
            <div className="bg-gray-200 rounded p-2">
              <DialogDescription className="text-4xl font-semibold text-gray-800 pb-5">
                {impact.quantity}
              </DialogDescription>
              <DialogDescription className="text-xs text-gray-800">
                {impact.subject}
              </DialogDescription>
            </div>
          </div>
        </DialogDescription>
        <DialogDescription className="text-xs font-semibold text-gray-800 pt-2 pl-4">
          Vendor
        </DialogDescription>
        <DialogDescription className="bg-white rounded rounded-md p-4">
          <div className="flex flex-row justify-between pb-2">
            <div className="flex flex-row items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="text-gray-800 font-semibold text-md">
                {vendor.name}
              </div>
            </div>
            <div className="text-gray-800 font-semibold">{vendor.amount}</div>
          </div>
          <DialogDescription className="text-xs text-gray-400 pb-2">
            {vendor.docs}
          </DialogDescription>
          <DialogDescription className="text-xs text-gray-800">
            {vendor.description}
          </DialogDescription>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalPopup;
