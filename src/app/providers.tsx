'use client';

import { FC } from 'react';
import {
    WalletProvider,
    SuietWallet,
    SuiWallet,
    EthosWallet,
    IDefaultWallet,
    defineStashedWallet
} from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { EnokiFlowProvider } from '@mysten/enoki/react';
import {
    createNetworkConfig,
    SuiClientProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";


/**
 * Custom provider component for integrating with third-party providers.
 * https://nextjs.org/docs/getting-started/react-essentials#rendering-third-party-context-providers-in-server-components
 * @param props
 * @constructor
 */

const { networkConfig } = createNetworkConfig({
    devnet: { url: getFullnodeUrl("devnet") },
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
});

const Providers: FC<any> = ({ children }) => {
    console.log("Providers - Environment variables:", {
        hasEnokiApiKey: !!process.env.NEXT_PUBLIC_ENOKI_API_KEY,
        hasGoogleClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    });

    return (
        <SuiClientProvider
            networks={networkConfig}
            defaultNetwork={"devnet"}
        >
            <WalletProvider
                defaultWallets={[
                    SuietWallet,
                    SuiWallet,
                    EthosWallet,
                    defineStashedWallet({
                        appName: 'Nexus Agent'
                    })
                ]}
            >
                <EnokiFlowProvider apiKey={process.env.NEXT_PUBLIC_ENOKI_API_KEY || ""}>
                    {children}
                </EnokiFlowProvider>
            </WalletProvider>
        </SuiClientProvider>
    );
};

export default Providers;
