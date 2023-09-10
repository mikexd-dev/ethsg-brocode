import React from "react";
import Image from "next/image";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  polygonMumbai,
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
} from "wagmi/chains";

import {
  ConnectKitProvider,
  SIWEConfig,
  SIWEProvider,
  Types,
  getDefaultConfig,
} from "connectkit";
import Avatar from "boring-avatars";
import { APP_NAME } from "@/lib/consts";
import { SiweMessage } from "siwe";

import { ModalProvider } from "@particle-network/connect-react-ui";
import { WalletEntryPosition } from "@particle-network/auth";
import {
  Ethereum,
  EthereumGoerli,
  PolygonMumbai,
} from "@particle-network/chains";
import { evmWallets } from "@particle-network/connect";

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
            overflow: "hidden",
            borderRadius: radius,
          }}
        />
      ) : (
        <div
          style={{
            overflow: "hidden",
            borderRadius: radius,
            height: size,
            width: size,
          }}
        >
          <Avatar
            name={address}
            variant="beam"
            colors={["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"]}
          />
        </div>
      )}
    </>
  );
};

const siweConfig = {
  getNonce: async () => {
    const res = await fetch(`/api/auth/siwe`, { method: "PUT" });
    if (!res.ok) throw new Error("Failed to fetch SIWE nonce");

    return res.text();
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      nonce,
      chainId,
      address,
      version: "1",
      uri: window.location.origin,
      domain: window.location.host,
      statement: "Sign In With Ethereum to prove you control this wallet.",
    }).prepareMessage();
  },
  verifyMessage: ({ message, signature }) => {
    return fetch(`/api/auth/siwe`, {
      method: "POST",
      body: JSON.stringify({ message, signature }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.ok);
  },
  getSession: async () => {
    const res = await fetch(`/api/auth/siwe`);
    if (!res.ok) throw new Error("Failed to fetch SIWE session");

    const { address, chainId } = await res.json();
    return address && chainId ? { address, chainId } : null;
  },
  signOut: () =>
    fetch(`/api/auth/siwe`, { method: "DELETE" }).then((res) => res.ok),
} satisfies SIWEConfig;
const WagmiProvider = ({ children }: WagmiProviderType) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      {/* <SIWEProvider {...siweConfig}>
        <ConnectKitProvider
          options={{
            customAvatar: MyCustomAvatar,
          }}
        > */}
      <ModalProvider
        options={{
          projectId: "c3bacdec-d550-48f0-bb4c-bd7efd3fba96",
          clientKey: "cvqgEVTsyg4jVUGMqpbava1SOfDxr7MLx3ztCHHX",
          appId: "76a1d3fa-21e2-4c6f-a3f0-cb3806c8fd07",
          chains: [PolygonMumbai],
          particleWalletEntry: {
            //optional: particle wallet config
            displayWalletEntry: true, //display wallet button when connect particle success.
            defaultWalletEntryPosition: WalletEntryPosition.BR,
            supportChains: [PolygonMumbai],
            customStyle: {}, //optional: custom wallet style
          },
          securityAccount: {
            //optional: particle security account config
            //prompt set payment password. 0: None, 1: Once(default), 2: Always
            promptSettingWhenSign: 1,
            //prompt set master password. 0: None(default), 1: Once, 2: Always
            promptMasterPasswordSettingWhenLogin: 1,
          },
          wallets: evmWallets({
            projectId: "walletconnect projectId", //replace with walletconnect projectId
            showQrModal: false,
          }),
        }}
        theme={"auto"}
        language={"en"} //optional：localize, default en
        walletSort={["Particle Auth", "Wallet"]} //optional：walelt order
        particleAuthSort={[
          //optional：display particle auth items and order
          "email",
          "phone",
          "google",
          "apple",
          "facebook",
        ]}
      >
        {children}
      </ModalProvider>

      {/* </ConnectKitProvider>
      </SIWEProvider> */}
    </WagmiConfig>
  );
};

export default WagmiProvider;
