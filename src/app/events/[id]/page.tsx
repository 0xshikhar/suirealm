"use client"
import React, { useState, useEffect, useRef } from "react";
import { PlayerWithControls } from "@/components/stream/StreamPlayer";
import { Src } from "@livepeer/react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { BiChat, BiHeart, BiShare } from "react-icons/bi";
import { useAccount } from "wagmi";
// Message type definition
interface ChatMessage {
    id: string;
    text: string;
    sender: string;
    timestamp: number;
}

const events = [
    {
        id: "1",
        title: "Gaming Trends on Core Blockchain",
        description: "Join us for an exciting discussion about the latest gaming trends on Core Blockchain.",
        date: "March 20",
        time: "6:00PM",
        playbackId: "f5eese9wwl7c7htl",
        thumbnail: "/images/portals.png",
        viewers: 1243,
        likes: 342
    },
    {
        id: "2",
        title: "Tutorial: How to play Umi's Friends and setup account",
        description: "Learn how to get started with Umi's Friends and set up your gaming account.",
        date: "March 26",
        time: "6:00PM",
        playbackId: "f5eese9wwl7c7htl",
        thumbnail: "/images/howtoplayumi.jpeg",
        viewers: 876,
        likes: 231
    },
    {
        id: "3",
        title: "Update: CyberPet introduces new skins and muchmore!",
        description: "Discover the latest updates to CyberPet including new skins and exciting features.",
        date: "March 27",
        time: "6:00PM",
        playbackId: "f5eese9wwl7c7htl",
        thumbnail: "/images/Cyberpet.png",
        viewers: 2156,
        likes: 543
    }
];

export default function EventPage({ params }: { params: { id: string } }) {
    const { address } = useAccount();
    const event = events.find(e => e.id === params.id);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Mock wallet address - in a real app, this would come from your authentication system
    const userWalletAddress = address

    // Load messages from localStorage on component mount
    useEffect(() => {
        const storedMessages = localStorage.getItem(`event-${params.id}-messages`);
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, [params.id]);

    // Scroll to bottom of chat when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    if (!event) {
        return notFound();
    }

    // Create source for the player
    const src: Src[] = [
        {
            // @ts-ignore
            type: "playback",
            src: event.playbackId,
        }
    ];

    // Handle sending a new message
    const handleSendMessage = () => {
        if (message.trim() === "") return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            text: message,
            sender: address || "",
            timestamp: Date.now()
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);

        // Save to localStorage
        localStorage.setItem(`event-${params.id}-messages`, JSON.stringify(updatedMessages));

        // Clear input
        setMessage("");
    };

    // Handle pressing Enter to send message
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    // Format timestamp
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4">
                <Link
                    href="/events"
                    className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
                >
                    <BsArrowLeft className="mr-2" />
                    Back to Events
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content - Video player and info */}
                <div className="lg:col-span-2">
                    <div className="bg-[#151515] rounded-lg overflow-hidden">
                        <div className="aspect-video">
                            <PlayerWithControls src={src} />
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-2xl font-bold text-white">{event.title}</h1>
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1 text-gray-400 hover:text-[#98ee2c]">
                                        <BiHeart className="text-xl" />
                                        <span>{event.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1 text-gray-400 hover:text-[#98ee2c]">
                                        <BiShare className="text-xl" />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                <div className="font-Agda uppercase text-[#98ee2c]">{event.date}</div>
                                <div>Starting at {event.time}</div>
                                <div>{event.viewers.toLocaleString()} viewers</div>
                            </div>

                            <p className="text-gray-300">{event.description}</p>
                        </div>
                    </div>
                </div>

                {/* Chat section */}
                <div className="bg-[#151515] rounded-lg p-4 h-[600px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <BiChat className="mr-2" />
                            Live Chat
                        </h2>
                        <span className="text-sm text-gray-400">{2} chatting</span>
                    </div>

                    <div
                        ref={chatContainerRef}
                        className="flex-grow overflow-y-auto mb-4 bg-[#0c0c0c] rounded-md p-3"
                    >
                        {messages.length === 0 ? (
                            <div className="text-gray-500 text-center py-4">No messages yet. Be the first to chat!</div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className="mb-3">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs text-[#98ee2c]">
                                            {msg.sender.slice(0, 2)}
                                        </div>
                                        <div className="ml-2">
                                            <div className="flex items-center">
                                                <span className="text-[#98ee2c] text-sm font-medium">
                                                    {msg.sender.slice(0, 6)}...{msg.sender.slice(-4)}
                                                </span>
                                                <span className="ml-2 text-gray-500 text-xs">
                                                    {formatTime(msg.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-white text-sm mt-1">{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Send a message..."
                                className="w-full bg-[#0c0c0c] border border-gray-800 rounded-md py-2 px-4 text-white focus:outline-none focus:border-[#98ee2c]"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#98ee2c] font-medium"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}