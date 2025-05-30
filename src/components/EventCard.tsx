"use client";

import { useEffect, useState } from 'react'
import { BiHeart } from 'react-icons/bi'
import { useRouter } from 'next/navigation'
import { IpfsImage } from 'react-ipfs-image'
import Image from 'next/image'

const style = {
    wrapper: `bg-[#303339] flex-auto w-[14rem] h-[24rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer`,
    imgContainer: `h-3/4 w-full overflow-hidden flex justify-center items-center`,
    nftImg: `w-full object-cover`,
    details: `p-3`,
    info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
    infoLeft: `flex-0.6 flex-wrap`,
    collectionName: `font-semibold text-sm text-[#8a939b]`,
    assetName: `font-bold text-lg mt-2`,
    infoRight: `flex-0.4 text-right`,
    priceTag: `font-semibold text-sm text-[#8a939b]`,
    priceValue: `flex items-center text-xl font-bold mt-2`,
    ethLogo: `h-5 mr-2`,
    likes: `text-[#8a939b] font-bold flex items-center w-full justify-end `,
    likeIcon: `text-xl mr-2`,
}

interface EventCardProps {
    eventItem: any;
    title: string;
    listings: any[];
}

const EventCard: React.FC<EventCardProps> = ({ eventItem, title, listings }) => {
    const [isListed, setIsListed] = useState(false)
    const [price, setPrice] = useState(0)
    const router = useRouter()
    useEffect(() => {
        const listing = listings.find((listing) => listing.asset.id === eventItem.id)
        if (Boolean(listing)) {
            setIsListed(true)
            setPrice(listing.buyoutCurrencyValuePerToken.displayValue)
        }
    }, [listings, eventItem])

    return (
        <div key={eventItem.id}
            className={style.wrapper}
            onClick={() => {
                router.push(`/nfts/${eventItem.id}?isListed=${isListed}`)
            }}
        >
            <div className={style.imgContainer}>
                {eventItem.image ? <IpfsImage hash={eventItem.image} className='m-10 mt-2  h-120 w-200 rounded-lg ' onClick={() => { }} />
                    : ""}
                {/* <img src={eventItem.image} alt={eventItem.name} className={style.nftImg} /> */}
            </div>
            <div className={style.details}>
                <div className={style.info}>
                    <div className={style.infoLeft}>
                        <div className={style.collectionName}>{title}</div>
                        <div className={style.assetName}>{eventItem.name}</div>
                    </div>
                    {isListed && (
                        <div className={style.infoRight}>
                            <div className={style.priceTag}>Price</div>
                            <div className={style.priceValue}>
                                <Image
                                    src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                                    alt="eth"
                                    className={style.ethLogo}
                                />
                                {price}
                            </div>
                        </div>
                    )}
                </div>
                <div className={style.likes}>
                    <span className={style.likeIcon}>
                        <BiHeart />
                    </span>{' '}
                    {eventItem.likes}
                </div>
            </div>
        </div>
    )
}

export default EventCard
