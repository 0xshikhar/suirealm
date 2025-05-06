import Image from 'next/image'
import Link from 'next/link'
import { FaGamepad, FaArrowRight, FaTrophy, FaCube, FaUsers, FaDiscord, FaTwitter } from 'react-icons/fa'
import { SiEthereum } from 'react-icons/si'
import { RiGamepadLine, RiVipCrownFill } from 'react-icons/ri'
import { GiCrossedSwords, GiTrophyCup, GiConsoleController } from 'react-icons/gi'
import { HiOutlineSparkles } from 'react-icons/hi'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[#050505]">
      {/* <Hero /> */}
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[120%] bg-gradient-to-b from-green-900/20 via-black to-black"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] bg-repeat opacity-10"></div>

          {/* Animated particles */}
          <div className="absolute top-20 left-[10%] w-2 h-2 rounded-full bg-[#98ee2c] animate-pulse opacity-70"></div>
          <div className="absolute top-40 right-[15%] w-3 h-3 rounded-full bg-green-400 animate-ping opacity-50"></div>
          <div className="absolute bottom-40 left-[20%] w-2 h-2 rounded-full bg-[#98ee2c] animate-ping opacity-60"></div>
          <div className="absolute bottom-60 right-[25%] w-2 h-2 rounded-full bg-green-400 animate-pulse opacity-50"></div>

          {/* Gaming-themed decoration */}
          <div className="hidden md:block absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-green-500/20 to-transparent blur-3xl"></div>
          <div className="hidden md:block absolute -top-20 -right-20 w-[250px] h-[250px] rounded-full bg-gradient-to-bl from-green-500/10 to-transparent blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left md:pr-8 mt-16">
              <div className="inline-flex items-center py-1 px-3 mb-6 bg-[#98ee2c]/10 rounded-full border border-green-500/20">
                <HiOutlineSparkles className="text-green-400 mr-2" />
                <span className="text-sm font-medium text-[#98ee2c]">Welcome to the Future of Gaming</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                <span className="block text-white">Play, Organize &</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#98ee2c] to-[#98ee2c]">Stream Games</span>
                <span className="block text-white">on Sui Blockchain</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Step into SuiRealm — where competitive gaming meets blockchain technology. Compete in tournaments, earn rewards, and own your in-game assets, all secured by the power of Sui.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/games"
                  className="px-6 py-3.5 bg-gradient-to-r from-[#98ee2c] to-[#00ff26] hover:from-green-600 hover:to-green-700 text-black font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-xl hover:shadow-green-500/20 hover:scale-[1.03] group"
                >
                  <GiConsoleController className="text-xl group-hover:animate-wiggle" />
                  <span>Start Playing</span>
                  <FaArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#features"
                  className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300 border border-white/10 hover:border-white/20"
                >
                  <span>Explore Features</span>
                </a>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-green-400">
                      P{i + 1}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-400">+2.5k players already joined</div>
              </div>
            </div>

            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-green-900/20 rounded-2xl blur-xl"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/30 to-green-900/30 rounded-2xl blur-sm opacity-50"></div>

              {/* Main image container */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_25px_rgba(0,200,83,0.2)]">
                {/* Overlay elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>

                <Image
                  src="/images/dashboard-preview.png"
                  alt="SuiRealm Platform Preview"
                  width={1200}
                  height={600}
                  className="w-full h-auto object-cover rounded-xl"
                  priority
                />

                {/* Floating UI elements */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-20">
                  <div className="flex items-center bg-black/40 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
                    <div className="h-8 w-8 bg-[#98ee2c] rounded-full flex items-center justify-center mr-2">
                      <RiVipCrownFill className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Prize Pool</div>
                      <div className="text-white font-bold">4,500 SUI</div>
                    </div>
                  </div>

                  <div className="bg-[#98ee2c] px-3 py-1.5 rounded-lg text-black font-medium text-sm">
                    Live Now
                  </div>
                </div>
              </div>

              {/* Stats cards */}
              <div className="absolute -bottom-6 -right-6 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-xl">
                <div className="flex items-center">
                  <GiTrophyCup className="text-yellow-500 text-xl mr-2" />
                  <div>
                    <div className="text-xs text-gray-400">Tournaments</div>
                    <div className="text-white font-bold">20+ Weekly</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-xl">
                <div className="flex items-center">
                  <SiEthereum className="text-green-500 text-xl mr-2" />
                  <div>
                    <div className="text-xs text-gray-400">NFT Rewards</div>
                    <div className="text-white font-bold">Exclusive</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <a href="#features" className="flex flex-col items-center text-gray-500 hover:text-white transition-colors duration-300">
            <span className="text-sm mb-2">Scroll Down</span>
            <div className="w-5 h-10 rounded-full border-2 border-gray-500 flex justify-center pt-1">
              <div className="w-1 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            </div>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] bg-repeat opacity-5 z-0"></div>
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center space-x-2 mb-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-green-500"></div>
              <span className="text-green-500 text-sm font-medium uppercase tracking-wider">Blockchain Gaming Platform</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-green-500"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Features & Capabilities</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Discover the cutting-edge features powering the next generation of blockchain gaming on SuiRealm.</p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl transition-all duration-500 hover:translate-y-[-8px] border border-gray-800 hover:border-green-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 mb-6 group-hover:scale-110 transition-transform duration-300 p-3">
                  <GiConsoleController className="text-3xl text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">Web3 Gaming</h3>
                <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">Play various blockchain games with true asset ownership and earn rewards through gameplay.</p>

                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">Asset Ownership</span>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">Play-to-Earn</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl transition-all duration-500 hover:translate-y-[-8px] border border-gray-800 hover:border-green-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 mb-6 group-hover:scale-110 transition-transform duration-300 p-3">
                  <GiTrophyCup className="text-3xl text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">Tournaments</h3>
                <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">Organize and participate in tournaments with transparent prize distribution and fair play.</p>

                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">Leaderboards</span>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">Smart Contracts</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl transition-all duration-500 hover:translate-y-[-8px] border border-gray-800 hover:border-green-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 mb-6 group-hover:scale-110 transition-transform duration-300 p-3">
                  <FaCube className="text-3xl text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">NFT Profiles</h3>
                <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">Create and customize your gaming profile as an NFT that showcases your achievements.</p>

                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">Digital Identity</span>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">Collectibles</span>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl transition-all duration-500 hover:translate-y-[-8px] border border-gray-800 hover:border-green-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 mb-6 group-hover:scale-110 transition-transform duration-300 p-3">
                  <FaUsers className="text-3xl text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">Social Gaming</h3>
                <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">Connect with other players, form teams, and build a reputation in the decentralized gaming community.</p>

                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">Team Building</span>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">Reputation</span>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl transition-all duration-500 hover:translate-y-[-8px] border border-gray-800 hover:border-green-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 mb-6 group-hover:scale-110 transition-transform duration-300 p-3">
                  <GiCrossedSwords className="text-3xl text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">Competitive Play</h3>
                <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">Engage in ranked matches and competitions with fair matchmaking and verified results on-chain.</p>

                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">Ranked System</span>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">Verified Results</span>
                </div>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl transition-all duration-500 hover:translate-y-[-8px] border border-gray-800 hover:border-green-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 mb-6 group-hover:scale-110 transition-transform duration-300 p-3">
                  <SiEthereum className="text-3xl text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">Tokenized Rewards</h3>
                <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">Earn and trade exclusive tokens and digital assets with real-world value through gameplay.</p>

                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">SUI Tokens</span>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">Marketplace</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Preview Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-green-900/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] bg-repeat opacity-5 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center space-x-2 mb-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-green-500"></div>
              <span className="text-green-500 text-sm font-medium uppercase tracking-wider">Popular Games</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-green-500"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Trending on SuiRealm</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Check out the most popular games that players are enjoying right now</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Game Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:border-green-500/30 hover:shadow-[0_0_25px_rgba(0,200,83,0.2)] hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>
              <Image
                src="/images/game-preview-1.jpg"
                alt="Crypto Crossword"
                width={600}
                height={300}
                className="w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-[#98ee2c]/20 text-green-400 text-xs font-medium px-2.5 py-1 rounded-md">Puzzle</span>
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-gray-900 bg-gray-800"></div>
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs ml-2">+120 playing</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors duration-300">Crypto Crossword</h3>
                <p className="text-gray-400 text-sm mb-4">Test your crypto knowledge with this challenging word puzzle game</p>
                <Link
                  href="/games/crypto-crossword"
                  className="inline-flex items-center text-green-400 text-sm font-medium"
                >
                  Play Now
                  <FaArrowRight className="ml-1.5 text-xs transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Game Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:border-green-500/30 hover:shadow-[0_0_25px_rgba(0,200,83,0.2)] hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>
              <Image
                src="/images/game-preview-2.jpg"
                alt="Blockchain Chess"
                width={600}
                height={300}
                className="w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-[#98ee2c]/20 text-green-400 text-xs font-medium px-2.5 py-1 rounded-md">Strategy</span>
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-gray-900 bg-gray-800"></div>
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs ml-2">+250 playing</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors duration-300">Blockchain Chess</h3>
                <p className="text-gray-400 text-sm mb-4">The classic game of chess, reimagined with blockchain verification</p>
                <Link
                  href="/games/chess"
                  className="inline-flex items-center text-green-400 text-sm font-medium"
                >
                  Play Now
                  <FaArrowRight className="ml-1.5 text-xs transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Game Card 3 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:border-green-500/30 hover:shadow-[0_0_25px_rgba(0,200,83,0.2)] hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>
              <Image
                src="/images/game-preview-3.jpg"
                alt="SuiTetris"
                width={600}
                height={300}
                className="w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-[#98ee2c]/20 text-green-400 text-xs font-medium px-2.5 py-1 rounded-md">Arcade</span>
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-gray-900 bg-gray-800"></div>
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs ml-2">+180 playing</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors duration-300">SuiTetris</h3>
                <p className="text-gray-400 text-sm mb-4">Stack blocks and compete for high scores with blockchain rewards</p>
                <Link
                  href="/games/tetris"
                  className="inline-flex items-center text-green-400 text-sm font-medium"
                >
                  Play Now
                  <FaArrowRight className="ml-1.5 text-xs transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/games"
              className="inline-flex items-center text-black px-6 py-3 bg-gradient-to-r from-[#98ee2c] to-[#00ff26] hover:from-green-600 hover:to-green-700 rounded-lg font-medium transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20"
            >
              Explore All Games
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-black z-0"></div>

        {/* Diagonal glow */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -left-40 -top-40 w-80 h-80 bg-[#98ee2c] rounded-full opacity-[0.15] blur-[100px]"></div>
          <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-[#98ee2c] rounded-full opacity-[0.15] blur-[100px]"></div>
        </div>

        {/* Animated elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#98ee2c] opacity-50 animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-[#98ee2c] opacity-40 animate-ping"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 p-8 lg:p-12 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.3)]">
            <div className="w-full md:w-2/3 lg:pr-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Join the Next Generation of Gaming?</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Connect your wallet, create your profile, and start earning rewards through gameplay today. Join thousands of players already competing on SuiRealm.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/games"
                  className="px-8 py-4 bg-gradient-to-r from-[#98ee2c] to-[#00ff26] hover:from-green-600 hover:to-green-700 text-black font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-green-500/20 hover:scale-[1.03]"
                >
                  <GiConsoleController className="text-xl" />
                  <span>Start Gaming Now</span>
                </Link>

                <div className="flex items-center gap-4">
                  <Link href="/events" className="text-white hover:text-green-400 transition-colors duration-300">
                    <FaTrophy className="text-2xl" />
                  </Link>
                  <Link href="https://discord.gg/suirealm" className="text-white hover:text-green-400 transition-colors duration-300">
                    <FaDiscord className="text-2xl" />
                  </Link>
                  <Link href="https://twitter.com/suirealm" className="text-white hover:text-green-400 transition-colors duration-300">
                    <FaTwitter className="text-2xl" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3 flex justify-center md:justify-end">
              <div className="relative w-full max-w-[240px]">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 to-green-800/30 rounded-2xl blur-sm"></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-white/10 text-center">
                  <div className="inline-flex bg-[#98ee2c]/10 text-green-400 text-xs font-medium px-3 py-1 rounded-full border border-green-500/20 mb-4">
                    Live Stats
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-white">2,500+</div>
                      <div className="text-sm text-gray-500">Active Players</div>
                    </div>

                    <div>
                      <div className="text-3xl font-bold text-white">20+</div>
                      <div className="text-sm text-gray-500">Games Available</div>
                    </div>

                    <div>
                      <div className="text-3xl font-bold text-white">15,000</div>
                      <div className="text-sm text-gray-500">SUI Rewards Distributed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-1.5 rounded-lg mr-2">
                <Image src="/core.png" alt="SuiRealm" width={24} height={24} className="rounded-md" />
              </div>
              <span className="text-lg font-bold text-white">SuiRealm</span>
            </div>

            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} SuiRealm. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
