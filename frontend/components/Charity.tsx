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

const CharityPopup = (props: any) => {

    const charity = props.charity

    if (charity.title == "")
        return <></>

    return <>
        <Dialog open={true}>
            <DialogContent className="max-w-[800px] bg-gray-100 pt-12">
                <DialogHeader className="flex w-full flex-row">
                    <div className="flex w-2/3">
                        <div className="flex">
                            <img src={charity.image} className="w-[100px] h-[100px] object-cover rounded-full"></img>
                        </div>
                        <div>
                            <p>{charity.npo}</p>
                        </div>
                    </div>
                    <div className="flex w-1/3">
                        <div className="bg-white rounded-lg p-4 w-full">
                            <div className="flex items-center">
                                <div>
                                    <img className="w-[40px] h-[40px] mr-2 object-cover rounded-sm" src="https://image.shutterstock.com/image-photo/man-woman-holding-hands-closeup-260nw-608080718.jpg"></img>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase">Fund Category</p>
                                    <p className="text-gray-800">{charity.category}</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <p className="text-sm text-gray-800 text-light">42 Charities</p>
                                <button className="bg-slate-900 p-2 mt-6 text-white rounded-lg px-4">Donate</button>
                            </div>
                        </div>
                    </div>
                </DialogHeader>
                <DialogDescription>

                </DialogDescription>
            </DialogContent>
        </Dialog>
    </>
};

export default CharityPopup;
