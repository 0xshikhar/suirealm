"use client"

import React from "react"
// @ts-ignore
import { Player, Src } from "@livepeer/react"
import { getIngest } from "@livepeer/react/external";
import { streamKey } from "@/lib/contracts";

interface BroadcastLoadProps {
    src: Src[]
}

export function BroadcastPlayer({ src }: BroadcastLoadProps) {
    return (
        <Player
            title="Livestream"
            src={src}
            autoPlay
            muted
            showPipButton
            objectFit="contain"
        />
    )
}

export function BroadcastLoad() {
    return (
        <Player
            title="Livestream"
            src={getIngest(streamKey)}
            autoPlay
            muted
            showPipButton
            objectFit="contain"
        />
    );
};