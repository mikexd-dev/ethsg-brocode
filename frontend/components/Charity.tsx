import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useContractRead } from "wagmi";

const CharityPopup = (props: any) => {
  const charity = props.charity;
  const { voteChainContractAbi, voteChainContractAddress } = props;
  const { data, isSuccess, isLoading }: any = useContractRead({
    address: voteChainContractAddress,
    abi: voteChainContractAbi,
    functionName: "getListOfAllProposalsByNPO",
    args: [charity.npoId],
  });

  if (charity.title == "") return <></>;

  return (
    <>
      <Dialog open={props.open} onOpenChange={props.setOpen}>
        <DialogContent className="max-w-[800px] bg-gray-100 pt-12">
          <DialogHeader className="flex w-full flex-row">
            <div className="flex w-2/3 items-center">
              <div className="flex mr-4">
                <img
                  src={
                    charity.category == "Animals"
                      ? "https://d.newsweek.com/en/full/2239986/cul-map-dogs-10.jpg"
                      : charity.category == "Families"
                      ? "https://cfsi.ph/wp-content/uploads/2021/10/Listening-in-Rakhine-State-Myanmar-scaled.jpg"
                      : charity.category == "Education"
                      ? "https://www.wiprofoundation.org/wp-content/uploads/2021/08/SEF_FI-1170x531_c.png"
                      : charity.category == "Special Needs"
                      ? "https://www.php.com/wp-content/uploads/2018/07/shutterstock_280367384.jpg"
                      : charity.category == "Environment"
                      ? "https://www.rochdaleonline.co.uk/uploads/f1/news/img/20221019_145022.jpg"
                      : ""
                  }
                  className="w-[100px] h-[100px] object-cover rounded-full"
                ></img>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-800">
                  {charity.npo}
                </p>
                <p className="text-md text-gray-700 my-2">{charity.url}</p>
                <p className="text-md text-gray-700 font-semibold">
                  S$8.3K raised | {data?.length} open proposals
                </p>
              </div>
            </div>
            <div className="flex w-1/3">
              <div className="bg-white rounded-lg p-4 w-full">
                <div className="flex items-center">
                  <div>
                    <img
                      className="w-[40px] h-[40px] mr-2 object-cover rounded-sm"
                      src="https://image.shutterstock.com/image-photo/man-woman-holding-hands-closeup-260nw-608080718.jpg"
                    ></img>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">
                      Fund Category
                    </p>
                    <p className="text-gray-800">{charity.category}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-sm text-gray-800 text-light">
                    42 Charities
                  </p>
                  <button className="bg-slate-900 p-2 mt-6 text-white rounded-lg px-4">
                    Donate
                  </button>
                </div>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="proposals">Proposals (TBD)</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <DialogDescription>
                <DialogDescription className="border border-[1] rounded-md p-4">
                  <div className="mb-6">
                    <DialogDescription className="text-sm font-semibold text-gray-800 pb-2">
                      Description
                    </DialogDescription>
                    <DialogDescription className="text-sm text-gray-800">
                      {charity.description}
                    </DialogDescription>
                  </div>
                  <div className="mb-6">
                    <DialogDescription className="text-sm font-semibold text-gray-800 pb-2">
                      Who We Serve
                    </DialogDescription>
                    <DialogDescription className="text-sm text-gray-800">
                      {charity.whoWeServe}
                    </DialogDescription>
                  </div>
                  <div className="mb-6">
                    <DialogDescription className="text-sm font-semibold text-gray-800 pb-2">
                      Impact to date
                    </DialogDescription>
                    <div className="flex gap-4">
                      {charity.impact.map((impact: any, key: any) => {
                        return (
                          <div
                            className="bg-gray-200 rounded p-2 w-1/3"
                            key={key}
                          >
                            <DialogDescription className="text-4xl font-semibold text-gray-800 pb-5">
                              {impact.quantity}
                            </DialogDescription>
                            <DialogDescription className="text-sm text-gray-800">
                              {impact.subject}
                            </DialogDescription>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </DialogDescription>
              </DialogDescription>
            </TabsContent>
            <TabsContent value="proposals">
              <DialogDescription>
                <DialogDescription className="border border-[1] rounded-md p-4">
                  <div className="mb-6">
                    <DialogDescription className="text-sm font-semibold text-gray-800 pb-2">
                      Open
                    </DialogDescription>
                    <div className="flex gap-4">
                      <div className="bg-white rounded-lg p-4 my-4 w-1/3">
                        <p className="font-semibold">Proposal #1</p>
                        <span className="tag tagBlue">
                          Proposal Description
                        </span>
                        <p className="mt-4 mb-4 flex items-center text-sm">
                          <img
                            src="https://www.mintface.xyz/content/images/2021/08/QmTndiF423kjdXsNzsip1QQkBQqDuzDhJnGuJAXtv4XXiZ-1.png"
                            className="w-[40px] rounded-full mr-2"
                          ></img>{" "}
                          Habitat for Humanity
                        </p>
                        <div className="flex justify-between w-full items-center">
                          <p className="text-gray-800">4000</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 my-4 w-1/3">
                        <p className="font-semibold">Proposal #1</p>
                        <span className="tag tagBlue">
                          Proposal Description
                        </span>
                        <p className="mt-4 mb-4 flex items-center text-sm">
                          <img
                            src="https://www.mintface.xyz/content/images/2021/08/QmTndiF423kjdXsNzsip1QQkBQqDuzDhJnGuJAXtv4XXiZ-1.png"
                            className="w-[40px] rounded-full mr-2"
                          ></img>{" "}
                          Habitat for Humanity
                        </p>
                        <div className="flex justify-between w-full items-center">
                          <p className="text-gray-800">4000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <DialogDescription className="text-sm font-semibold text-gray-800 pb-2">
                      Past
                    </DialogDescription>
                    <div className="flex gap-4">
                      <div className="bg-white rounded-lg p-4 my-4 w-1/3">
                        <p className="font-semibold">Proposal #1</p>
                        <span className="tag tagBlue">
                          Proposal Description
                        </span>
                        <p className="mt-4 mb-4 flex items-center text-sm">
                          <img
                            src="https://www.mintface.xyz/content/images/2021/08/QmTndiF423kjdXsNzsip1QQkBQqDuzDhJnGuJAXtv4XXiZ-1.png"
                            className="w-[40px] rounded-full mr-2"
                          ></img>{" "}
                          Habitat for Humanity
                        </p>
                        <div className="flex justify-between w-full items-center">
                          <p className="text-gray-800">4000</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 my-4 w-1/3">
                        <p className="font-semibold">Proposal #1</p>
                        <span className="tag tagBlue">
                          Proposal Description
                        </span>
                        <p className="mt-4 mb-4 flex items-center text-sm">
                          <img
                            src="https://www.mintface.xyz/content/images/2021/08/QmTndiF423kjdXsNzsip1QQkBQqDuzDhJnGuJAXtv4XXiZ-1.png"
                            className="w-[40px] rounded-full mr-2"
                          ></img>{" "}
                          Habitat for Humanity
                        </p>
                        <div className="flex justify-between w-full items-center">
                          <p className="text-gray-800">4000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogDescription>
              </DialogDescription>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CharityPopup;
