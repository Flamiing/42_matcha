import { useBreakpoints } from "../../hooks/useBreakpoints";
import DesktopBrowse from "./DesktopBrowse";
import MobileBrowse from "./MobileBrowse";

const index = () => {
	const { isMobile, isTablet, isDesktop } = useBreakpoints();

	return (
		<main className="flex flex-1 justify-center items-center flex-col">
			<section className="container max-w-6xl text-center my-20 px-3 flex flex-wrap justify-evenly gap-20">
				{isDesktop && <DesktopBrowse />}
				{!isDesktop && <MobileBrowse />}
			</section>
		</main>
	);
};

export default index;
