export default function Headers() {
    const hero = [
        'Tentang Kami',
        'Pusat Bantuan',
        'Hubungi Kami',
        'Artikel',
    ]
    
	return (
		<div className="w-full pb-4 text-white justify-between flex items-center">
			<div className="flex gap-12 items-center">
				<span className="text-4xl font-extrabold">KOSE</span>
                <div className="gap-8 flex">
                    {hero.map((item, index) => (
                        <button key={index} className="font-medium text-xl cursor-pointer">{item}</button>
                    ))}
                </div>
			</div>
            <div className="gap-3 flex">
                <button className="bg-white text-[#1D30AA] px-9 py-4 rounded-xl font-bold">
                    Sign Up
                </button>
                <button className="border-white border px-9 py-4 rounded-xl font-bold">
                    Sign In
                </button>
            </div>
		</div>
	);
}
