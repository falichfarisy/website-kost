export interface Category {
	id: string;
	name: string;
	count: number;
	color: string;
}

export const categories: Category[] = [
	{ id: "putra", name: "Putra", count: 450, color: "bg-blue-100 text-blue-600" },
	{ id: "putri", name: "Putri", count: 380, color: "bg-pink-100 text-pink-600" },
	{
		id: "campuran",
		name: "Campuran",
		count: 170,
		color: "bg-purple-100 text-purple-600",
	},
	{
		id: "premium",
		name: "Premium",
		count: 85,
		color: "bg-amber-100 text-amber-600",
	},
	{
		id: "motor",
		name: "Parkir Motor",
		count: 620,
		color: "bg-green-100 text-green-600",
	},
	{
		id: "mobil",
		name: "Parkir Mobil",
		count: 290,
		color: "bg-indigo-100 text-indigo-600",
	},
];