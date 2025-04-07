import React from "react";
import Link from "next/link";
import { BsArrowRight, BsCalendar2Event } from "react-icons/bs";
import { FaGamepad } from "react-icons/fa";

const EventPage = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-[url('/images/event-banner.png')] bg-cover bg-center"></div>
                <div className="container mx-auto px-4 py-10 md:py-20 relative z-20">
                    <div className="max-w-3xl">
                        <h1 className="text-white font-Agda text-4xl md:text-7xl uppercase mb-4 leading-tight">
                            Create <span className="text-[#98ee2c]">Game Event</span>
                        </h1>
                        <p className="text-white font-Outfit text-lg md:text-xl font-light mb-6 md:mb-8 max-w-2xl">
                            Host your own gaming events and connect with players around the world
                        </p>
                    </div>
                </div>
            </div>

            {/* Event Creation Form */}
            <div className="container mx-auto px-4 py-10">
                <div className="max-w-3xl mx-auto bg-[#202020] rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Event Details</h2>

                    <form className="space-y-6">
                        <div>
                            <label htmlFor="eventName" className="block text-white mb-2">Event Name</label>
                            <input
                                type="text"
                                id="eventName"
                                className="w-full bg-[#151515] text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#98ee2c] focus:border-transparent"
                                placeholder="Enter event name"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="eventDate" className="block text-white mb-2">Date</label>
                                <input
                                    type="date"
                                    id="eventDate"
                                    className="w-full bg-[#151515] text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#98ee2c] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor="eventTime" className="block text-white mb-2">Time</label>
                                <input
                                    type="time"
                                    id="eventTime"
                                    className="w-full bg-[#151515] text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#98ee2c] focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="eventDescription" className="block text-white mb-2">Description</label>
                            <textarea
                                id="eventDescription"
                                rows={4}
                                className="w-full bg-[#151515] text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#98ee2c] focus:border-transparent"
                                placeholder="Describe your event"
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="eventGame" className="block text-white mb-2">Game</label>
                            <select
                                id="eventGame"
                                className="w-full bg-[#151515] text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#98ee2c] focus:border-transparent"
                            >
                                <option value="">Select a game</option>
                                <option value="chess">Chess</option>
                                <option value="tetris">Tetris</option>
                                <option value="wordle">Wordle</option>
                                <option value="sudoku">Sudoku</option>
                                <option value="snake-ladder">Snake & Ladder</option>
                                <option value="crypto-crossword">Crypto Crossword</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="eventThumbnail" className="block text-white mb-2">Event Thumbnail</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-[#98ee2c] transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-7">
                                        <BsCalendar2Event className="w-8 h-8 text-gray-400" />
                                        <p className="pt-1 text-sm text-gray-400">Upload thumbnail image</p>
                                    </div>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                            <button
                                type="button"
                                className="px-6 py-2 border border-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-[#98ee2c] text-black font-bold rounded-md hover:bg-[#7bc922] transition-colors"
                            >
                                Create Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Tips Section */}
            <div className="container mx-auto px-4 py-10">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Tips for a Successful Event</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#202020] p-5 rounded-lg">
                            <div className="w-12 h-12 bg-[#98ee2c]/20 rounded-full flex items-center justify-center mb-4">
                                <FaGamepad className="text-[#98ee2c] text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Choose the Right Game</h3>
                            <p className="text-gray-400">Select games that are popular and easy to understand for a wider audience.</p>
                        </div>

                        <div className="bg-[#202020] p-5 rounded-lg">
                            <div className="w-12 h-12 bg-[#98ee2c]/20 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#98ee2c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Schedule Wisely</h3>
                            <p className="text-gray-400">Pick times when your target audience is most likely to be available.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPage; 