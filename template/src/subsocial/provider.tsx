import React, { createContext, useEffect, useState } from "react";

import { SubsocialApi } from "@subsocial/api";
import { generateCrustAuthToken } from '@subsocial/api/utils/ipfs'

import { CustomNetwork, Testnet } from "./config";

import { logTransaction, signAndSendTx } from "./wallets/polkadotjs"

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
    signAndSendTx: (tx: any, accountId: string, callback?: (result: any) => void) => void
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
    signAndSendTx: () => { }
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
    const api = await SubsocialApi.create({
      ...network,
      useServer: {
        httpRequestMethod: 'get'
      }
    });

    setApi(api);
    setisReady(true);
  }

  const changeNetwork = (customNetwork: CustomNetwork) => {
    setNetwork(customNetwork);
    initialize();
  }

  //TODO: setup crust for testnet and 

  const setupCrustIPFS = (mnemonic: string) => {
    if (!isReady || api == null) return;
    const authHeader = generateCrustAuthToken(mnemonic)

    // Use this ipfs object, to set authHeader for writing on Crust IPFS cluster.
    api.ipfs.setWriteHeaders({
      authorization: 'Basic ' + authHeader
    })

  }

  return (
    <SubsocialContext.Provider
      value={{ isReady, api, initialize, network, changeNetwork, setupCrustIPFS, polkadotjs: { logTransaction, signAndSendTx } }}
    >
      {children}
    </SubsocialContext.Provider>
  );
};