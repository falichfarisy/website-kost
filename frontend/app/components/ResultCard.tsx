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
};

export default function ResultCard({ id, category, location, nameKos, facility, price, slotRoom }: ResultProps) {
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
    <Link href={`/kos/${id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow transition-transform duration-300 transform hover:-translate-y-1">
        <div className="relative h-48 bg-gray-100 group-hover:brightness-105 transition-filter duration-300">
          <Image
            src="/sample-bedroom.svg"
            alt={nameKos}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[category]}`}>
              {categoryLabels[category]}
            </span>
          </div>
          {slotRoom <= 3 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Tersisa {slotRoom}
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium truncate">{upperLocation}</p>
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#011E55] transition-colors">
                {nameKos}
              </h3>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {facility.slice(0, 3).map((fas, index) => (
              <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {fas}
              </span>
            ))}
            {facility.length > 3 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                +{facility.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <span className="text-lg font-bold text-[#011E55]">{priceNominal}</span>
              <span className="text-xs text-gray-500">/bulan</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-label="Rating 4.5 dari 5">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.359a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">4.5</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
