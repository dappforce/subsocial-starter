import React, { useContext, useEffect } from "react";
import { SubsocialContext } from "./subsocial/provider";
import { IpfsContent } from '@subsocial/api/substrate/wrappers'
import { Mainnet, Testnet } from "./subsocial/config";

// This is the start of the React app built using Subsocial Starter.
const App = () => {

  // SubsocialContext can be used using useContext hook and it provides
  // access to the [api] module i.e. SubsocialApi and other methods like
  // changeNetwork (changing from testnet(default) to mainnet/localnet).
  // It also gives you access to getters like [isReady] that helps you know [api] 
  // initlaization status.  
  const { isReady, api, network, polkadotjs } = useContext(SubsocialContext)

  useEffect(() => {
    console.log(`Is API ready: ${isReady}`)
    if (!isReady) return;

    // Once [api] is initialized, all the API methods from Subsocial SDK are in
    // ready-to-use condition. For example: Fetching data about a Space. 
    //
    // To know more about Subsocial SDK methods, Checkout:
    // Quick Reference Guide: https://docs.subsocial.network/docs/develop/quick-reference
    // Subsocial Playground:  https://play.subsocial.network
    const getSpace = async () => {
      const space = await api!.findSpace({ id: '23' })
      console.log(space)
    }

    getSpace()
  }, [isReady])

  // Creating a space on Subsocial network. 
  const createSpace = async () => {
    // Always assure, the [api] is not null using [isReady] property.
    if (!isReady) return;

    // Saves this data on IPFS. 
    // On testnet, the data is stored on CRUST IPFS test mnemonic automatically. 
    //
    // To change the IPFS either pass [CustomNetwork] or call [setupCrustIPFS] with 
    // your menmonic (MAKE SURE TO HIDE MNEOMIC BEFORE UPLOADING TO PUBLIC NETWORK).
    const cid = await api!.ipfs.saveContent({
      about: 'Subsocial is an open protocol for decentralized social networks and marketplaces. It`s built with Substrate and IPFS',
      image: null,
      name: 'Subsocial',
      tags: ['subsocial']
    })
    const substrateApi = await api!.blockchain.api

    const spaceTransaction = substrateApi.tx.spaces.createSpace(
      IpfsContent(cid),
      null // Permissions config (optional)
    )

    // Using the [polkadotjs] property, imported from context hook.
    // This gives you with a set of methods like [getAllAccounts], [logTransaction], 
    // [signAndSendTx], etc. These are using Polkadotjs extension library internally.
    const accounts = await polkadotjs.getAllAccounts();
    if (accounts.length > 0) {
      polkadotjs.signAndSendTx(spaceTransaction, accounts[0].address);
    }
  }

  return <>
    <h1>
      Welcome to Subsocial Starter.
    </h1>
    <h3>
      You are {isReady ? 'connected' : 'connecting'} to Subsocial's {network === Testnet ? 'Testnet' : network === Mainnet ? 'Mainnet' : 'Custom Network'}.
    </h3>
  </>
};

export default App;