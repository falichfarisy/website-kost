export interface KosData {
	id: number;
	name: string;
	location: string;
	price: number;
	rating: number;
	reviews: number;
	type: string;
	badge?: string;
	image?: null;
}

export const allKos: KosData[] = [
	{
		id: 1,
		name: "Kost Mahkota Regency",
		location: "Malang - Signature",
		price: 1200000,
		rating: 4.8,
		reviews: 124,
		type: "Putra",
		badge: "Terpopuler",
		image: null,
	},
	{
		id: 2,
		name: "Kost Alam Hijau",
		location: "Surabaya - Wonokromo",
		price: 950000,
		rating: 4.6,
		reviews: 89,
		type: "Putri",
		badge: "Promo",
		image: null,
	},
	{
		id: 3,
		name: "Kost Melati Square",
		location: "Jakarta - Tebet",
		price: 1800000,
		rating: 4.9,
		reviews: 256,
		type: "Campuran",
		badge: "Best Rated",
		image: null,
	},
	{
		id: 4,
		name: "Kost Platinum Residence",
		location: "Bandung - Dago",
		price: 1500000,
		rating: 4.7,
		reviews: 167,
		type: "Putra",
		image: null,
	},
	{
		id: 5,
		name: "Kost Senja Timur",
		location: "Yogyakarta - Sleman",
		price: 800000,
		rating: 4.5,
		reviews: 78,
		type: "Putri",
		badge: "Baru",
		image: null,
	},
	{
		id: 6,
		name: "Kost Nusantara",
		location: "Semarang - Candisari",
		price: 1100000,
		rating: 4.6,
		reviews: 134,
		type: "Campuran",
		image: null,
	},
	{
		id: 7,
		name: "Kost Indigo Residence",
		location: "Surabaya - Gubeng",
		price: 1350000,
		rating: 4.7,
		reviews: 98,
		type: "Putra",
		image: null,
	},
	{
		id: 8,
		name: "Kost Permata Hijau",
		location: "Jakarta - Kemang",
		price: 2200000,
		rating: 4.9,
		reviews: 187,
		type: "Campuran",
		badge: "Premium",
		image: null,
	},
];