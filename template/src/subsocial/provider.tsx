import React, { createContext, useEffect, useState } from "react";

import { SubsocialApi } from "@subsocial/api";
import { generateCrustAuthToken } from '@subsocial/api/utils/ipfs'

import { CustomNetwork, Testnet } from "./config";

import { logTransaction, signAndSendTx, getAllAccounts } from "./wallets/polkadotjs"
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import { waitReady } from '@polkadot/wasm-crypto'
import { Buffer } from 'buffer';

// @ts-ignore
window.Buffer = Buffer;

interface Props {
  children: React.ReactNode;
}

interface SubsocialContextInterface {
  api: SubsocialApi | null,
  isReady: boolean,
  initialize: () => void,
  network: CustomNetwork,
  changeNetwork: (network: CustomNetwork) => void,
  setupCrustIPFS: (mneomic: string) => void,
  polkadotjs: {
    logTransaction: (response: any) => void,
    signAndSendTx: (tx: any, accountId: string, callback?: (result: any) => void) => void,
    getAllAccounts: () => Promise<InjectedAccountWithMeta[]>
  }
}

export const SubsocialContext = createContext({
  api: null,
  isReady: false,
  initialize: () => { },
  network: Testnet,
  changeNetwork: () => { },
  setupCrustIPFS: () => { },
  polkadotjs: {
    logTransaction: () => { },
    signAndSendTx: () => { },
    getAllAccounts: () => getAllAccounts()
  }
} as SubsocialContextInterface);

export const SubsocialContextProvider = ({ children }: Props) => {
  const [isReady, setisReady] = useState(false);
  const [api, setApi] = useState<SubsocialApi | null>(null);
  const [network, setNetwork] = useState<CustomNetwork>(Testnet);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    await waitReady()
    const newApi = await SubsocialApi.create({
      ...network,
      useServer: {
        httpRequestMethod: 'get'
      }
    });

    setApi(newApi);
    setisReady(true);

    // For testnet using CRUST IPFS test Mnemonic. 
    if (network === Testnet) {
      const authHeader = generateCrustAuthToken('bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice')
      // Use this ipfs object, to set authHeader for writing on Crust IPFS cluster.
      newApi.ipfs.setWriteHeaders({
        authorization: 'Basic ' + authHeader
      })
    }
  }

  const changeNetwork = (customNetwork: CustomNetwork) => {
    setNetwork(customNetwork);
    initialize();
  }


  const setupCrustIPFS = async (mnemonic: string) => {
    if (!isReady || api === null) throw Error('API is not ready yet.');

    const authHeader = generateCrustAuthToken(mnemonic)
    // Use this ipfs object, to set authHeader for writing on Crust IPFS cluster.
    api.ipfs.setWriteHeaders({
      authorization: 'Basic ' + authHeader
    })
  }

  return (
    <SubsocialContext.Provider
      value={{ isReady, api, initialize, network, changeNetwork, setupCrustIPFS, polkadotjs: { logTransaction, signAndSendTx, getAllAccounts } }}
    >
      {children}
    </SubsocialContext.Provider>
  );
};