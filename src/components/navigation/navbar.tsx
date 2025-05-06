"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { ConnectButton, useWallet } from '@suiet/wallet-kit'


const Navbar = () => {
	const router = useRouter();
	const { address, connected } = useWallet();

	return (
		<div className="absolute top-0 left-0 right-0 z-50 backdrop-blur-sm bg-black/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20">
					<Link href="/" className="flex items-center space-x-3">
						<div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-xl">
							<Image src="/core.png" alt="SuiRealm" width={36} height={36} className="rounded-md" />
						</div>
						<div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
							SuiRealm
						</div>
					</Link>

					<div className="flex items-center space-x-4">
						<Link
							href="/games"
							className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/20 hover:scale-105 flex items-center justify-center"
						>
							<span>Try App</span>
						</Link>
						<div className="">
							<ConnectButton>Connect Wallet</ConnectButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
