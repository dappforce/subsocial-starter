import { useContext, useEffect, useState } from "react";
import { SubsocialContext } from "./subsocial/provider";
import polkadotjs from "./subsocial/wallets/polkadotjs";
import { IpfsContent } from '@subsocial/api/substrate/wrappers'
import { CustomNetwork, Mainnet, Testnet } from "./subsocial/config";
import "./App.css";

// This is the start of the React app built using Subsocial Starter.
const App = () => {

  // SubsocialContext can be used using useContext hook and it provides
  // access to the [api] module i.e. SubsocialApi and other methods like
  // changeNetwork (changing from testnet(default) to mainnet/localnet).
  // It also gives you access to getters like [isReady] that helps you know [api] 
  // initlaization status.  
  const { isReady, api, network } = useContext(SubsocialContext)
  const [response, setResponse] = useState({})

  useEffect(() => {
    console.log(`Is API ready: ${isReady}`)
  }, [isReady, api])

  // Once [api] is initialized, all the API methods from Subsocial SDK are in
  // ready-to-use condition. For example: Fetching data about a Space. 
  //
  // To know more about Subsocial SDK methods, Checkout:
  // Quick Reference Guide: https://docs.subsocial.network/docs/develop/quick-reference
  // Subsocial Playground:  https://play.subsocial.network
  const getSpace = async () => {
    if (!isReady) {
      setResponse({ message: "Unable to connect to the API." })
      return;
    }
    const spaceId = '1005'
    const space = await api!.findSpace({ id: spaceId })
    setResponse(space ?? { message: "Space not found." })
  }

  // Creating a space on Subsocial network. 
  const createSpace = async () => {
    // Always assure, the [api] is not null using [isReady] property.
    if (!isReady) {
      setResponse({ message: "Unable to connect to the API." })
      return;
    }

    // Saves this data on IPFS. 
    // On testnet, the data is stored on CRUST IPFS test mnemonic automatically. 
    //
    // To change the IPFS either pass [CustomNetwork] or call [setupCrustIPFS] with 
    // your mnemonic (MAKE SURE TO HIDE MNEOMIC BEFORE UPLOADING TO PUBLIC NETWORK).
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
      await polkadotjs.signAndSendTx(spaceTransaction, accounts[0].address);
      setResponse({ message: "API response added in browser console logs." })
    }
  }

  const getNetworkName = (network: CustomNetwork): string => {
    if (network === Testnet) return 'Testnet';
    if (network === Mainnet) return 'Mainnet';
    return 'Custom Network';
  }

  return <>
    <div className="header">
      <h1>
        Welcome to Subsocial Starter.
      </h1>
      <h4>
        You are {isReady ? <span className="green">connected</span> : <span className="red">connecting</span>} to Subsocial's {getNetworkName(network)}.
      </h4>
    </div>
    <div className="main">
      <div className="button-container">
        <Button onClick={() => getSpace()} title="Fetch Space" />
        <Button onClick={() => createSpace()} title="Create Space" />
      </div>
    </div>
  </>
};

const Button = ({ onClick, title }: { onClick: () => Promise<void>, title: string }) => {
  const [loading, setLoading] = useState(false)
  return <div onClick={async () => {
    if (loading) return;

    setLoading(true)
    await onClick()
    setLoading(false)
  }} className="button">
    {loading ? 'Loading...' : title}
  </div>
}

export default App;