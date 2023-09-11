const Charities = () => {

    return <>
        <div className="w-full mt-12">
            <h1 className="text-3xl font-semibold mb-4">Charities</h1>

            <div className="flex gap-4 w-full">
                <div className="bg-white rounded-lg p-4 w-1/3">
                    <p className="flex justify-between font-semibold">
                        <img className="w-[60px] h-[60px] object-cover rounded-full" src="https://images.unsplash.com/photo-1611003228941-98852ba62227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFieSUyMGRvZ3xlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"></img> 
                        <span className="tag tagBlue">Family</span>
                    </p>
                    <p className="text-slate-800 mt-2 font-semibold">Habitat for Humanity</p>
                    <div className="mt-12">
                        <hr/>
                        <div className="mt-2 flex justify-between">
                            <p className="text-gray-400 text-sm uppercase font-semibold">Proposals</p>
                            <p className="text-sm">1 in progress | 3 passed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>

}

export default Charities;