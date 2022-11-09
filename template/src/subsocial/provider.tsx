import React, { createContext, useEffect, useState, useCallback } from "react";

import { SubsocialApi } from "@subsocial/api";
import { generateCrustAuthToken } from '@subsocial/api/utils/ipfs'

import { CRUST_TEST_AUTH_KEY, CustomNetwork, Testnet } from "./config";
import { waitReady } from '@polkadot/wasm-crypto'
import { Buffer } from 'buffer';

// @ts-ignore
window.Buffer = Buffer;

interface Props {
  children: React.ReactNode;
  defaultNetwork?: CustomNetwork
}

interface SubsocialContextInterface {
  api: SubsocialApi | null,
  isReady: boolean,
  initialize: () => void,
  network: CustomNetwork,
  changeNetwork: (network: CustomNetwork) => void,
  setupCrustIPFS: (mneomic: string) => void
}

export const SubsocialContext = createContext({
  api: null,
  isReady: false,
  initialize: () => { },
  network: Testnet,
  changeNetwork: () => { },
  setupCrustIPFS: () => { }
} as SubsocialContextInterface);

export const SubsocialContextProvider = ({ children, defaultNetwork }: Props) => {
  const [isReady, setisReady] = useState(false);
  const [api, setApi] = useState<SubsocialApi | null>(null);
  const [network, setNetwork] = useState<CustomNetwork>(defaultNetwork ?? Testnet);

  const initialize = useCallback(async () => {
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
      // Use this ipfs object, to set authHeader for writing on Crust IPFS cluster.
      newApi.ipfs.setWriteHeaders({
        authorization: 'Basic ' + CRUST_TEST_AUTH_KEY
      })
    }
  }, [])

  useEffect(() => {
    initialize();
  }, [initialize]);

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
      value={{ isReady, api, initialize, network, changeNetwork, setupCrustIPFS }}
    >
      {children}
    </SubsocialContext.Provider>
  );
};