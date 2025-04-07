import React from "react";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { BiHeart } from "react-icons/bi";
import Image from "next/image";

const explore = () => {
    return (
        <div className="">
            <figure className="flex flex-col items-center justify-center pt-10 pb-10">
                <div className="rounded-3xl bg-[url('https://shikhar.xyz/wp-content/uploads/2023/06/eventPage.png')] bg-center bg-cover before:opacity-0">
                    <div className="text-left pb-10 align-middle min-w-[300px] md:min-w-[600px] lg:min-w-[1100px] h-[300px] pl-5 md:pl-10 p-5">
                        <div className="text-white font-Agda text-[40px] md:text-[70px] uppercase max-w-[90%] md:max-w-[650px]">
                            Explore Event
                        </div>
                        <p className="text-white font-Outfit text-base md:text-lg font-light mb-6 md:mb-8 max-w-[90%] md:max-w-2xl">
                            Your Favorite Game Streaming Events are here
                        </p>
                        <Link
                            href="/livestream"
                            className="inline-flex items-center text-base md:text-lg px-4 md:px-6 py-2 md:py-3 bg-white uppercase font-Agda font-bold text-black hover:bg-[#f0f0f0] transition-colors rounded-md"
                        >
                            Join Live Event
                            <BsArrowRight className="ml-2" />
                        </Link>
                    </div>
                </div>
            </figure>

            {/* Event Cards - Made responsive */}
            <div className="container mx-auto px-3 md:px-6 py-10">
                <div className="flex flex-col justify-center items-center">
                    {/* Responsive grid for event cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {/* Event Card 1 */}
                        <div className="bg-[#202020] rounded-lg overflow-hidden shadow-xl">
                            <figure>
                                <Image
                                    src="/images/portals.png"
                                    alt="Gaming Trends on Manta"
                                    width={500}
                                    height={200}
                                    className="w-full h-48 object-cover"
                                />
                            </figure>
                            <div className="p-5">
                                <div className="flex flex-wrap justify-between items-center mb-2">
                                    <div className="flex items-center space-x-2 mb-2 md:mb-0">
                                        <div className="font-Agda text-[16px] md:text-[18px] uppercase text-[#98ee2c]">March 20</div>
                                        <div className="font-Agda text-sm uppercase text-white">Starting At 6:00PM</div>
                                    </div>
                                    <div>
                                        <BiHeart className="text-xl text-gray-400 hover:text-[#98ee2c] cursor-pointer" />
                                    </div>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Gaming Trends on Core Blockchain</h2>
                                <Link
                                    href="/events/1"
                                    className="flex items-center bg-[#98ee2c] text-black px-4 py-2 rounded font-bold hover:bg-[#7bc922] transition-colors"
                                >
                                    Watch Live
                                    <BsArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>

                        {/* Event Card 2 */}
                        <div className="bg-[#202020] rounded-lg overflow-hidden shadow-xl">
                            <figure>
                                <Image
                                    src="/images/howtoplayumi.jpeg"
                                    alt="Umi's Friends Stream"
                                    width={500}
                                    height={200}
                                    className="w-full h-48 object-cover"
                                />
                            </figure>
                            <div className="p-5">
                                <div className="flex flex-wrap justify-between items-center mb-2">
                                    <div className="flex items-center space-x-2 mb-2 md:mb-0">
                                        <div className="font-Agda text-[16px] md:text-[18px] uppercase text-[#98ee2c]">March 26</div>
                                        <div className="font-Agda text-sm uppercase text-white">Starting At 6:00PM</div>
                                    </div>
                                    <div>
                                        <BiHeart className="text-xl text-gray-400 hover:text-[#98ee2c] cursor-pointer" />
                                    </div>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Tutorial: How to play Umi&rsquo;s friends and setup account</h2>
                                <Link
                                    href="/events/2"
                                    className="flex items-center bg-[#98ee2c] text-black px-4 py-2 rounded font-bold hover:bg-[#7bc922] transition-colors"
                                >
                                    Watch Live
                                    <BsArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>

                        {/* Event Card 3 */}
                        <div className="bg-[#202020] rounded-lg overflow-hidden shadow-xl">
                            <figure>
                                <Image
                                    src="/images/Cyberpet.png"
                                    alt="CyberPet"
                                    width={500}
                                    height={200}
                                    className="w-full h-48 object-cover"
                                />
                            </figure>
                            <div className="p-5">
                                <div className="flex flex-wrap justify-between items-center mb-2">
                                    <div className="flex items-center space-x-2 mb-2 md:mb-0">
                                        <div className="font-Agda text-[16px] md:text-[18px] uppercase text-[#98ee2c]">March 27</div>
                                        <div className="font-Agda text-sm uppercase text-white">Starting At 6:00PM</div>
                                    </div>
                                    <div>
                                        <BiHeart className="text-xl text-gray-400 hover:text-[#98ee2c] cursor-pointer" />
                                    </div>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Update: CyberPet introduces new skins and muchmore!</h2>
                                <Link
                                    href="/events/3"
                                    className="flex items-center bg-[#98ee2c] text-black px-4 py-2 rounded font-bold hover:bg-[#7bc922] transition-colors"
                                >
                                    Watch Live
                                    <BsArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="bg-gradient-to-r from-[#202020] to-[#151515] py-12 mt-10">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-Agda text-white mb-4">Join Our Next Live Event</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Stay updated with the latest gaming trends and tutorials from industry experts
                    </p>
                    <Link
                        href="/event"
                        className="inline-flex items-center text-base md:text-lg px-6 md:px-8 py-2 md:py-3 bg-[#98ee2c] text-black uppercase font-Agda font-bold hover:bg-[#7bc922] transition-colors rounded-md"
                    >
                        Create Your Own Event
                        <BsArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default explore;
