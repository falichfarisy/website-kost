import Image from "next/image";

type ResultProps = {
	category: "putra" | "putri";
	location: string;
	nameKos: string;
	fasility: string[];
	price: number;
	slotRoom: number;
};

export default function ResultCard({ category, location, nameKos, fasility, price, slotRoom }: ResultProps) {
	const upperLocation = location.toUpperCase();
    const priceNominal = 'Rp' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

	return (
		<div className="bg-white rounded-xl w-107 h-80.25 flex flex-col">
			<div className="bg-[#EDEDED] rounded-t-xl justify-center flex">
				<Image
					src={"/sample-bedroom.svg"}
					alt="sample-bedroom"
					width={216}
					height={144}
				/>
			</div>
			<div className="px-3.5 pb-5 mt-2 space-y-3 flex flex-col">
				<span className="py-1 px-4 border border-[#9D9D9D] font-medium rounded-xl w-fit">{category}</span>
				<div className="flex flex-col">
					<p className="font-medium">{upperLocation}</p>
					<p className="text-sm text-[#707070]">{nameKos}</p>
				</div>
				<p className="text-sm font-medium text-[#707070]">{fasility.join(" | ")}</p>
				<div className="flex justify-between">
					<p className="font-medium text-xl">{priceNominal}/bulan</p>
					<p className={slotRoom <= 3 ? "text-red-500" : "text-black"}>Sisa {slotRoom} Kamar</p>
				</div>
			</div>
		</div>
	);
}
