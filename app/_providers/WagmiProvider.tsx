import React from 'react';
import Image from 'next/image';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  polygonMumbai,
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
} from 'wagmi/chains';

import {
  ConnectKitProvider,
  SIWEConfig,
  SIWEProvider,
  Types,
  getDefaultConfig,
} from 'connectkit';
import Avatar from 'boring-avatars';
import { APP_NAME } from '@/lib/consts';
import { SiweMessage } from 'siwe';

type WagmiProviderType = {
  children: React.ReactNode;
};

const chains = [
  polygonMumbai,
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
];
const projectId = process.env.NEXT_PUBLIC_W3C_PID;

// const { connectors } = getDefaultWallets({
//   appName: 'My RainbowKit App',
//   projectId: projectId,
//   chains,
// });

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: APP_NAME,
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    walletConnectProjectId: projectId,
    chains,
  })
);

const MyCustomAvatar = ({
  address,
  ensImage,
  ensName,
  size,
  radius,
}: Types.CustomAvatarProps) => {
  return (
    <>
      {ensImage ? (
        <Image
          src={ensImage}
          alt={ensName ?? "User's avatar"}
          width={size}
          height={size}
          style={{
            overflow: 'hidden',
            borderRadius: radius,
          }}
        />
      ) : (
        <div
          style={{
            overflow: 'hidden',
            borderRadius: radius,
            height: size,
            width: size,
          }}
        >
          <Avatar
            name={address}
            variant="beam"
            colors={['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']}
          />
        </div>
      )}
    </>
  );
};

const siweConfig = {
  getNonce: async () => {
    const res = await fetch(`/api/auth/siwe`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to fetch SIWE nonce');

    return res.text();
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      nonce,
      chainId,
      address,
      version: '1',
      uri: window.location.origin,
      domain: window.location.host,
      statement: 'Sign In With Ethereum to prove you control this wallet.',
    }).prepareMessage();
  },
  verifyMessage: ({ message, signature }) => {
    return fetch(`/api/auth/siwe`, {
      method: 'POST',
      body: JSON.stringify({ message, signature }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.ok);
  },
  getSession: async () => {
    const res = await fetch(`/api/auth/siwe`);
    if (!res.ok) throw new Error('Failed to fetch SIWE session');

    const { address, chainId } = await res.json();
    return address && chainId ? { address, chainId } : null;
  },
  signOut: () =>
    fetch(`/api/auth/siwe`, { method: 'DELETE' }).then((res) => res.ok),
} satisfies SIWEConfig;
const WagmiProvider = ({ children }: WagmiProviderType) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <SIWEProvider {...siweConfig}>
        <ConnectKitProvider
          options={{
            customAvatar: MyCustomAvatar,
          }}
        >
          {children}
        </ConnectKitProvider>
      </SIWEProvider>
    </WagmiConfig>
  );
};

export default WagmiProvider;
