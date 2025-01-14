import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBreakpoints } from "../../../hooks/useBreakpoints";
import { useAuth } from "../../../context/AuthContext";

const Header: React.FC = () => {
	const { isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { isMobile, isTablet, isDesktop } = useBreakpoints();

	// Reset menu state when screen size changes
	useEffect(() => {
		if (!isMobile && !isTablet) setIsMenuOpen(false);
	}, [isTablet, isDesktop]);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleLinkClick = () => {
		setIsMenuOpen(false);
	};

	const handleLogout = async () => {
		const response = await logout();
		if (response.success) {
			navigate("/");
		}
	};

	return (
		<header
			className={`transition-all duration-300 z-30 ${
				isMenuOpen ? "bg-primary" : "bg-white"
			}`}
		>
			<div className="container mx-auto lx:p-7 py-5 px-2">
				<div className="flex justify-between items-center flex-wrap">
					<h1
						className={`text-3xl font-bold ${
							isMenuOpen ? "text-white" : "text-primary"
						}`}
					>
						<Link to="/" onClick={handleLinkClick}>
							Matcha
						</Link>
					</h1>
					{isDesktop && (
						<>
							<nav className="flex text-black justify-evenly flex-1">
								<Link to="/">
									<button className="text-font-main font-medium btn whitespace-nowrap text-base px-8 py-3 rounded-full hover:ease-in-out duration-300 hover:bg-secondary-light">
										Home
									</button>
								</Link>
								<Link to="/browse">
									<button className="text-font-main font-medium btn whitespace-nowrap text-base px-8 py-3 rounded-full hover:ease-in-out duration-300 hover:bg-secondary-light">
										Browse
									</button>
								</Link>
								<Link to="/profile">
									<button className="text-font-main font-medium btn whitespace-nowrap text-base px-8 py-3 rounded-full hover:ease-in-out duration-300 hover:bg-secondary-light">
										Profile
									</button>
								</Link>
							</nav>
							{!isAuthenticated && (
								<div className="flex items-center gap-1 text-sm">
									<Link to="/login">
										<button className="text-font-main btn whitespace-nowrap text-sm px-6 py-2 rounded-full hover:ease-in-out duration-300 hover:bg-secondary-light">
											Login
										</button>
									</Link>
									<Link to="/register">
										<button className="text-font-main btn whitespace-nowrap text-sm px-6 py-2 rounded-full hover:ease-in-out duration-300 hover:bg-secondary-light">
											Register
										</button>
									</Link>
								</div>
							)}
							{isAuthenticated && (
									<button
										onClick={handleLogout}
										className="text-font-main btn whitespace-nowrap text-sm px-6 py-2 rounded-full hover:ease-in-out duration-300 hover:bg-primary-monochromatic hover:text-white"
									>
										Logout
									</button>
							)}
						</>
					)}
					{(isMobile || isTablet) && (
						<button
							onClick={toggleMenu}
							className="flex rounded-full px-2 py-3 bg-white w-10 h-10 justify-between items-center flex-col"
							aria-label={isMenuOpen ? "Close menu" : "Open menu"}
						>
							<div className="flex flex-col items-center justify-center w-5 h-5">
								<span
									className={`h-[2px] w-5 bg-black transition-all duration-300 absolute ${
										isMenuOpen
											? "rotate-45"
											: "-translate-y-2"
									}`}
								></span>
								<span
									className={`h-[2px] w-5 bg-black transition-all duration-300 ${
										isMenuOpen ? "opacity-0" : "opacity-100"
									}`}
								></span>
								<span
									className={`h-[2px] w-5 bg-black transition-all duration-300 absolute ${
										isMenuOpen
											? "-rotate-45"
											: "translate-y-2"
									}`}
								></span>
							</div>
						</button>
					)}
					{(isMobile || isTablet) && (
						<div
							className={`fixed inset-0 bg-primary transform transition-transform duration-300 ease-in-out px-3 ${
								isMenuOpen
									? "translate-x-0"
									: "translate-x-full"
							} z-40 mt-20`}
						>
							<nav className="container flex flex-col text-white m-auto w-full">
								<div className="flex items-center justify-center flex-col gap-5 mb-10">
									<Link to="/" onClick={handleLinkClick}>
										<button className="whitespace-nowrap text-base px-8 py-3 rounded-full hover:ease-in-out duration-300 hover:bg-primary-monochromatic">
											Home
										</button>
									</Link>
									<Link
										to="/browse"
										onClick={handleLinkClick}
									>
										<button className="whitespace-nowrap text-base px-8 py-3 rounded-full hover:ease-in-out duration-300 hover:bg-primary-monochromatic">
											Browse
										</button>
									</Link>
									<Link
										to="/profile"
										onClick={handleLinkClick}
									>
										<button className="whitespace-nowrap text-base px-8 py-3 rounded-full hover:ease-in-out duration-300 hover:bg-primary-monochromatic">
											Profile
										</button>
									</Link>
								</div>
								{(!isAuthenticated && (
									<div className="border-t border-white mt-4 pt-4 px-6 flex items-center justify-start">
										<Link
											to="/login"
											onClick={handleLinkClick}
										>
											<button className="rounded-full px-3 py-2 text-white hover:ease-in-out duration-300 hover:bg-primary-monochromatic">
												Login
											</button>
										</Link>
										<Link
											to="/register"
											onClick={handleLinkClick}
										>
											<button className="rounded-full px-3 py-2 text-white hover:ease-in-out duration-300 hover:bg-primary-monochromatic">
												Register
											</button>
										</Link>
									</div>
								)) ||
									(isAuthenticated && (
										<div className="border-t border-white mt-4 pt-4 px-6 flex items-center justify-start">
											<button
												onClick={handleLogout}
												className="rounded-full px-3 py-2 text-white hover:ease-in-out duration-300 hover:bg-primary-monochromatic"
											>
												Logout
											</button>
										</div>
									))}
							</nav>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
