import { useMediaQuery } from "./useMediaQuery";

export const useBreakpoints = () => {
	const isMobile = useMediaQuery("(max-width: 767px)");
	const isTablet = useMediaQuery(
		"(min-width: 768px) and (max-width: 1023px)"
	);
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const isLargeDesktop = useMediaQuery("(min-width: 1280px)");

	return {
		isMobile,
		isTablet,
		isDesktop,
		isLargeDesktop,
	};
};
