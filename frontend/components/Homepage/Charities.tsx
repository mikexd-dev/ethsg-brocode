import ProposalComponent from "@/components/Proposal";
import { useState } from "react";
import CharityPopup from "@/components/Charity";

const Charities = ({ npo }: any) => {
  console.log(npo, "npo");
  const CharitiesArray = [
    {
      npo: "Animal Rescue Foundation",
      image: "https://d.newsweek.com/en/full/2239986/cul-map-dogs-10.jpg",
      url: "https://www.animalrescuefoundation.org/",
      amountRaised: "8.3k",
      proposalsPassed: 3,
      description:
        "The Animal Rescue Foundation is seeking funds to establish a rescue and rehabilitation program for stray animals in the community. The program will provide medical care, shelter, and adoption services for abandoned and homeless animals.",
      whoWeServe:
        "The Animal Rescue Foundation is seeking funds to establish a rescue and rehabilitation program for stray animals in the community. The program will provide medical care, shelter, and adoption services for abandoned and homeless animals.",
      impact: [
        {
          subject: "Houses built across APAC",
          quantity: 5480,
        },
        {
          subject: "Families served in singapore",
          quantity: 5480,
        },
        {
          subject: "Volunteers fighting poverty with us",
          quantity: 40540,
        },
      ],
      category: "Animals",
    },
    {
      npo: "Family Services Organization",
      image:
        "https://cfsi.ph/wp-content/uploads/2021/10/Listening-in-Rakhine-State-Myanmar-scaled.jpg",
      url: "https://www.familyservices.org/",
      amountRaised: "15.2k",
      proposalsPassed: 5,
      description:
        "The Family Services Organization is seeking funds to implement a comprehensive support and empowerment program for families facing financial, emotional, and social challenges. The program will offer counseling, financial assistance, and educational workshops to help families overcome obstacles and achieve stability.",
      whoWeServe: "Families in need of support and empowerment",
      impact: [
        {
          subject: "Families served",
          quantity: 1200,
        },
        {
          subject: "Workshops conducted",
          quantity: 80,
        },
        {
          subject: "Volunteers engaged",
          quantity: 350,
        },
      ],
      category: "Families",
    },
    {
      npo: "Education Foundation",
      image:
        "https://www.wiprofoundation.org/wp-content/uploads/2021/08/SEF_FI-1170x531_c.png",
      url: "https://www.educationfoundation.org/",
      amountRaised: "22.5k",
      proposalsPassed: 7,
      description:
        "The Education Foundation is seeking funds to launch a STEM (Science, Technology, Engineering, and Mathematics) education initiative for underserved students in low-income communities. The program will provide access to quality STEM education, resources, and mentorship to help students excel in these fields and pursue higher education and career opportunities.",
      whoWeServe: "Underserved students in low-income communities",
      impact: [
        {
          subject: "Students reached",
          quantity: 3000,
        },
        {
          subject: "STEM programs implemented",
          quantity: 15,
        },
        {
          subject: "Mentors engaged",
          quantity: 200,
        },
      ],
      category: "Education",
    },
    {
      npo: "Special Needs Support Group",
      image:
        "https://www.php.com/wp-content/uploads/2018/07/shutterstock_280367384.jpg",
      url: "https://www.specialneedssupport.org/",
      amountRaised: "18.7k",
      proposalsPassed: 4,
      description:
        "The Special Needs Support Group is requesting funds to establish an inclusive learning center for children with special needs. The center will offer specialized educational programs, therapies, and support services tailored to the unique needs of each child, promoting their growth and development.",
      whoWeServe: "Children with special needs",
      impact: [
        {
          subject: "Children served",
          quantity: 500,
        },
        {
          subject: "Therapies provided",
          quantity: 1200,
        },
        {
          subject: "Support services offered",
          quantity: 800,
        },
      ],
      category: "Special Needs",
    },
    {
      npo: "Environmental Action Group",
      image:
        "https://www.rochdaleonline.co.uk/uploads/f1/news/img/20221019_145022.jpg",
      url: "https://www.environmentalactiongroup.org/",
      amountRaised: "25.3k",
      proposalsPassed: 6,
      description:
        "The Environmental Action Group is seeking funds to implement a community-based environmental conservation program. The program will focus on promoting sustainable practices, raising awareness about environmental issues, and engaging community members in conservation efforts.",
      whoWeServe: "Communities affected by environmental issues",
      impact: [
        {
          subject: "Communities engaged",
          quantity: 20,
        },
        {
          subject: "Sustainable practices promoted",
          quantity: 1000,
        },
        {
          subject: "Volunteers involved",
          quantity: 500,
        },
      ],
      category: "Environment",
    },
  ];

  const [showPopup, setShowPopup] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState({});

  const showCharity = (index: number) => {
    setSelectedCharity(CharitiesArray[index]);
    setShowPopup(true);
  };

  return (
    <>
      <div className="w-full mt-12">
        <h1 className="text-3xl font-semibold mb-4">Charities</h1>

        <div className="grid grid-cols-3 gap-4 w-full">
          {CharitiesArray.map((charity, index) => {
            return (
              <div
                key={index}
                onClick={() => showCharity(index)}
                className="bg-white rounded-lg p-4 w-full cursor-pointer"
              >
                <p className="flex justify-between font-semibold">
                  <img
                    className="w-[60px] h-[60px] object-cover rounded-full"
                    src={charity.image}
                  ></img>
                  <span className="tag tagBlue">Family</span>
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
        <CharityPopup charity={selectedCharity} />
      ) : (
        <></>
      )}
    </>
  );
};

export default Charities;
