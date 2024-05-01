'use client'

import { BeaconEvent } from "@airgap/beacon-dapp";
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { Fragment, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const options = {
  name: 'MyAwesomeDapp',
  iconUrl: 'https://taquito.io/img/favicon.svg',
  preferredNetwork: 'ghostnet',
  eventHandlers: {
    PERMISSION_REQUEST_SUCCESS: {
      handler: async (data: any) => {
        console.log('permission data:', data);
      },
    },
  },
}

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

export default function Home() {
  const [user, setUser] = useState()

  const wallet = useRef<BeaconWallet>()

  useEffect(() => {
    wallet.current = new BeaconWallet(options as any)
    Tezos.setWalletProvider(wallet.current)

    wallet.current.client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, (payload: any) => {
      if (!payload) {
        setUser(undefined)
        return
      }

      setUser(payload.address)
    })
  }, [])

  async function handleClick() {
    const response = await wallet.current!.requestPermissions()
    console.log('requestPermissions:', response)
  }

  async function handleDisconnect() {
    await wallet.current!.clearActiveAccount()
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        {!!user && <Fragment>Connected: {user}</Fragment>}
        {!user
          ? <button onClick={handleClick}>Connect</button>
          : <button onClick={handleDisconnect}>Disconnect</button>
        }
      </div>
    </main>
  );
}
