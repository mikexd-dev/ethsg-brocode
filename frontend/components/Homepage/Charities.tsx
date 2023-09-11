import ProposalComponent from "@/components/Proposal";
import { useState } from "react";
import CharityPopup from "@/components/Charity";
import { useContractRead } from "wagmi";

const Charities = ({
  npo,
  voteChainContractAddress,
  voteChainContractAbi,
}: any) => {
  console.log(npo, "npo");

  const [showPopup, setShowPopup] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState({});

  const showCharity = (index: number) => {
    setSelectedCharity(npo[index]);
    setShowPopup(true);
  };

  if (npo == null) {
    npo = [];
  }

  return (
    <>
      <div className="w-full mt-12">
        <h1 className="text-3xl font-semibold mb-4">Charities</h1>

        <div className="grid grid-cols-3 gap-4 w-full overflow-y-scroll max-h-[600px]">
          {npo.map((charity: any, index: any) => {
            return (
              <div
                key={index}
                onClick={() => showCharity(index)}
                className="bg-white rounded-lg p-4 w-full cursor-pointer"
              >
                <p className="flex justify-between font-semibold">
                  <img
                    className="w-[60px] h-[60px] object-cover rounded-full"
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
                  ></img>
                  <span className="tag tagBlue">{charity.category}</span>
                </p>
                <p className="text-slate-800 mt-2 font-semibold">
                  {charity.npo}
                </p>
                <div className="mt-12">
                  <hr />
                  <div className="mt-2 flex justify-between">
                    <p className="text-gray-400 text-sm uppercase font-semibold">
                      Proposals
                    </p>
                    <p className="text-sm">1 in progress | 3 passed</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showPopup && selectedCharity ? (
        <CharityPopup
          charity={selectedCharity}
          voteChainContractAddress={voteChainContractAddress}
          voteChainContractAbi={voteChainContractAbi}
          open={showPopup}
          setOpen={setShowPopup}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Charities;
