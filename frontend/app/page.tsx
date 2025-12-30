import Headers from "@/app/components/Headers";
import Image from "next/image";
import SearchIcon from "./components/SearchIcon";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col w-full bg-[url('/background.svg')]">
			<div className="px-5 py-10 flex-1 flex flex-col">
				<Headers />
				<div className="justify-center items-center flex flex-col gap-9 flex-1 text-center text-[#F1F1F1]">
					<span className="font-semibold text-6xl">Temukan Kost yang Tepat untuk Kebutuhanmu</span>
					<span className="text-2xl w-2/3">
						Kami membantu kamu menemukan berbagai pilihan kost dengan mudah dan cepat. Pilih berdasarkan lokasi, harga,
						dan fasilitas yang sesuai dengan kebutuhanmu.
					</span>
					<div className="w-2/5 shadow-lg items-center pl-5 flex flex-row bg-[#011E55] h-15 rounded-xl">
						<SearchIcon />
						<input
							type="text"
							placeholder="Masukkan nama kos/daerah/alamat"
							className="w-full h-full px-4 mx-3 text-xl focus:outline-none"
						/>
            <button className="rounded bg-[#ECECEC] text-[#1935A8] h-full shadow-xl hover:bg-[#bcbcbc] w-1/3 font-medium text-2xl">Cari</button>
					</div>
				</div>
			</div>
			<footer className="relative w-full h-50">
				<Image
					src="/wave-footer.svg"
					alt="wave-footer"
					fill
					className="object-cover"
					priority
				/>
			</footer>
		</div>
	);
}
