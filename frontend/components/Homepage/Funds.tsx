const Funds = () => {

    const FundsArray = [
        {
            "id": "1",
            "name": "Animals",
            "image": "https://images.pexels.com/photos/15175668/pexels-photo-15175668/free-photo-of-a-black-dog-in-close-up-shot.jpeg",
            "bytes32": "0x2ea975709bff84e46009afad424470760eeddd15908236dc585ac043ada98c8e"
        },
        {
            "id": "2",
            "name": "Special Needs",
            "image": "https://images.pexels.com/photos/339619/pexels-photo-339619.jpeg",
            "bytes32": "0xc3e11e7a6567cc2e6ea1824d22a33f503781f8dc9094ee008bb4030e094f091d"
        },
        {
            "id": "3",
            "name": "Family",
            "image": "https://images.pexels.com/photos/7983157/pexels-photo-7983157.jpeg",
            "bytes32": "0xcdd78f062154f618fa9e2c7e443110cc61eaad907c91236f9e752b62b2bad605"
        },
        {
            "id": "4",
            "name": "Education",
            "image": "https://images.pexels.com/photos/1720188/pexels-photo-1720188.jpeg",
            "bytes32": "0x6377c45cecbe1f20eaf46bd3f27ae079882e88d579f5eed558666cd6bfd75606"
        }
    ]

    return <>
        <div className="w-full">
            <h1 className="text-3xl font-semibold mb-4">Funds</h1>

            <div className="flex gap-4 w-full">
                {
                    FundsArray.map((fund) => {
                        return <>
                            <div className="bg-white rounded-lg p-4 w-1/4">
                                <p className="flex items-center font-semibold"><img className="w-[60px] h-[60px] object-cover rounded-sm mr-2" src={fund.image}></img> 
                                {fund.name}</p>

                                <div className="flex mt-12 items-center justify-between">
                                    <p className="text-2xl font-semibold text-gray-800">1.2M</p>
                                    <button className="bg-slate-900 p-2 text-white rounded-lg px-4">Donate</button>
                                </div>
                            </div>
                        </>
                    })
                }
            </div>
        </div>
    </>

}

export default Funds;