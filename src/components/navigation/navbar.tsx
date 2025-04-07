"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { cn } from "@/lib/utils";
import { ConnectButton, useWallet } from '@suiet/wallet-kit'
import { FaFaucetDrip } from "react-icons/fa6";
import { User } from "lucide-react";


const Navbar = () => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { address, connected } = useWallet();

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<div className="bg-black w-full px-4 py-3 sticky top-0 z-50">
			<div className="mx-4 flex items-center justify-between">
				<Link href="/" className="flex items-center">
					<Image src="/core.png" alt="Suirealm" width={32} height={32} className="rounded-xl mx-2" />
					<div className="text-[28px] md:text-[32px] text-white font-serif">
						Suirealm
					</div>
				</Link>

				{/* Desktop Search Bar - hidden on mobile */}
				<div className="hidden md:flex flex-1 mx-4 max-w-[520px] items-center bg-[#363840] rounded-lg hover:bg-[#4c505c]">
					<div className="text-[#8a939b] mx-3 font-bold text-lg">
						<AiOutlineSearch />
					</div>
					<input
						className="h-10 w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]"
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search for Games, Events, and more"
					/>
					<button
						onClick={() => {
							if (searchQuery.trim()) {
								router.push(`/searching/${searchQuery}`);
							}
						}}
						className="text-white px-4 py-2"
					>
						Search
					</button>
				</div>

				{/* Desktop Menu Items - hidden on mobile */}
				<div className="hidden md:flex items-center">

					<div className="text-[#c8cacd] hover:text-white cursor-pointer px-2 font-bold"
						onClick={() => router.push("/games")}
					>
						Games
					</div>
					<div className="text-[#c8cacd] hover:text-white cursor-pointer px-2 font-bold"
						onClick={() => router.push("/events")}
					>
						Events
					</div>
					<div
						className="font-bold flex items-center text-[#8a939b] px-2 hover:text-white cursor-pointer"
						onClick={() => router.push("/nft")}
					>
						Mint Profile
					</div>
					<div className="px-1">
						<Link
							href="/profile"
							className="text-[#c8cacd] hover:text-white cursor-pointer px-4 font-bold flex items-center"
						>
							<User className="text-3xl bg-white text-black text-bold rounded-full p-1" />
						</Link>
					</div>

					<div className="text-[#c8cacd] hover:text-white cursor-pointer px-1 font-bold flex items-center"
						onClick={() => router.push("/token")}
					>
						<FaFaucetDrip className="text-2xl text-[#98ee2c]" />
					</div>
					<div className="px-4">
						<div className="flex items-center gap-4">
							{connected && (
								<span className="text-sm text-white">
									{address?.slice(0, 6)}...{address?.slice(-4)}
								</span>
							)}
							<div className="w-40 md:block z-20">
								<ConnectButton>Connect Wallet</ConnectButton>
							</div>
						</div>
					</div>

				</div>

				{/* Mobile Menu Button - visible only on mobile */}
				<div className="md:hidden flex items-center">
					<button
						onClick={toggleMenu}
						className="text-white text-2xl focus:outline-none"
					>
						{isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
					</button>
				</div>
			</div>

			{/* Mobile Menu - hidden on desktop */}
			<div
				className={cn(
					"md:hidden absolute left-0 right-0 bg-black transition-all duration-300 ease-in-out overflow-hidden",
					isMenuOpen ? "max-h-[500px] py-4" : "max-h-0"
				)}
			>
				{/* Mobile Search Bar */}
				<div className="flex mx-4 my-3 items-center bg-[#363840] rounded-lg">
					<div className="text-[#8a939b] mx-3 font-bold text-lg">
						<AiOutlineSearch />
					</div>
					<input
						className="h-10 w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]"
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Enter Text"
					/>
					<button
						onClick={() => {
							if (searchQuery.trim()) {
								router.push(`/searching/${searchQuery}`);
								setIsMenuOpen(false);
							}
						}}
						className="text-white px-4 py-2"
					>
						Search
					</button>
				</div>

				{/* Mobile Menu Items */}
				<div className="flex flex-col px-4 space-y-4 pb-4">
					<div
						className="text-[#c8cacd] hover:text-white cursor-pointer font-bold py-2"
						onClick={() => {
							router.push("/events");
							setIsMenuOpen(false);
						}}
					>
						Explore
					</div>
					<div
						className="text-[#c8cacd] hover:text-white cursor-pointer font-bold py-2 flex items-center"
						onClick={() => {
							router.push("/nft");
							setIsMenuOpen(false);
						}}
					>
						<CgProfile className="mr-2" /> Profile
					</div>
					<div className="text-[#c8cacd] hover:text-white cursor-pointer font-bold py-2 flex items-center">
						<MdOutlineAccountBalanceWallet className="mr-2" /> Wallet
					</div>
					<div className="py-2">
						<div className="flex items-center gap-4">
							{connected && (
								<span className="text-sm text-white">
									{address?.slice(0, 6)}...{address?.slice(-4)}
								</span>
							)}
							<div className="w-40 md:block z-20">
								<ConnectButton>Connect Wallet</ConnectButton>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
