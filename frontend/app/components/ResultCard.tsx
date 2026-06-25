import Image from "next/image";
import Link from "next/link";

type ResultProps = {
  id: number;
  category: "putra" | "putri" | "campur";
  location: string;
  nameKos: string;
  facility: string[];
  price: number;
  slotRoom: number;
  rating?: number;
};

export default function ResultCard({ id, category, location, nameKos, facility, price, slotRoom, rating = 0 }: ResultProps) {
  const upperLocation = location.toUpperCase();
  const priceNominal = "Rp" + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const categoryColors: Record<string, string> = {
    putra: "bg-blue-100 text-blue-700",
    putri: "bg-pink-100 text-pink-700",
    campur: "bg-purple-100 text-purple-700",
  };

  const categoryLabels: Record<string, string> = {
    putra: "Putra",
    putri: "Putri",
    campur: "Campur",
  };

  return (
    <Link href={`/kos/${id}`} className="block group h-full">
      <div className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-yellow-400 transition-all duration-300 group-hover:-translate-y-2 h-full flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-[#011E55] to-[#0a2d6e] overflow-hidden">
          <Image
            src="/sample-bedroom.svg"
            alt={nameKos}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
          <div className="absolute top-4 left-4">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${categoryColors[category]}`}>
              {categoryLabels[category]}
            </span>
          </div>
          {slotRoom <= 3 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
              Tersisa {slotRoom}
            </div>
          )}
        </div>
        
        <div className="p-5 space-y-4 flex-1 flex flex-col">
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-bold mb-1 truncate tracking-wider">{upperLocation}</p>
            <h3 className="text-lg font-extrabold text-gray-900 line-clamp-2 group-hover:text-[#011E55] transition-colors leading-tight">
              {nameKos}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {facility.slice(0, 3).map((fas, index) => (
              <span key={index} className="text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg font-medium">
                {fas}
              </span>
            ))}
            {facility.length > 3 && (
              <span className="text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg font-medium">
                +{facility.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div>
              <span className="text-xl font-extrabold text-[#011E55]">{priceNominal}</span>
              <span className="text-xs text-gray-500 font-medium ml-1">/bln</span>
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1.5 rounded-xl">
              <svg className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20" aria-label="Rating">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.359a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-sm text-gray-900">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
