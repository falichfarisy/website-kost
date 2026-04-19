export interface FeaturedKos {
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

export const featuredKos: FeaturedKos[] = [
	{
		id: 1,
		name: "Kost Mahkota Regency",
		location: "Malang - Signature",
		price: 1200000,
		rating: 4.8,
		reviews: 124,
		type: "Putra",
		badge: "Terpopuler",
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
	},
	{
		id: 4,
		name: "Kost Platinum Residence",
		location: "Bandung - Dago",
		price: 1500000,
		rating: 4.7,
		reviews: 167,
		type: "Putra",
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
	},
	{
		id: 6,
		name: "Kost Nusantara",
		location: "Semarang - Candisari",
		price: 1100000,
		rating: 4.6,
		reviews: 134,
		type: "Campuran",
	},
];