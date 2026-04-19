export interface BannerSlide {
	id: number;
	title: string;
	subtitle: string;
	cta: string;
	ctaLink: string;
	bgGradient: string;
}

export const bannerSlides: BannerSlide[] = [
	{
		id: 1,
		title: "Promo Spesial",
		subtitle: "Diskon hingga 50% untuk kost baru",
		cta: "Lihat Promo",
		ctaLink: "/search?promo=true",
		bgGradient: "from-[#011E55] to-[#0a2d6e]",
	},
	{
		id: 2,
		title: "Kost Terdekat Kampus",
		subtitle: "Temukan kost strategis di sekitar kampus",
		cta: "Cari Sekarang",
		ctaLink: "/search?location=kampus",
		bgGradient: "from-[#011E55] to-blue-600",
	},
	{
		id: 3,
		title: "Kost Premium",
		subtitle: "Fasilitas lengkap, nyaman seperti rumah",
		cta: "Jelajahi",
		ctaLink: "/search?type=premium",
		bgGradient: "from-[#011E55] to-[#0a2d6e]",
	},
];