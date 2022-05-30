import React, { useEffect, useState } from "react";
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import StepComponent from "./components/Steps";
import Form from "./components/Form";
import {
  CompleteShell,
  ConnectShell,
  ReleaseShell,
  VerifyShell,
} from "./components/Shell";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import logo from "./logo.svg";

const mm = (window as any).ethereum as any;

export enum State {
  Connect,
  ReleaseEncryption,
  SignAndRegister,
  Verify,
  Complete,
}

export type EthEncryptedData = {
  version: string;
  nonce: string;
  ephemPublicKey: string;
  ciphertext: string;
};

export type AppState = {
  state: State;
  provider: Web3Provider;
  signer?: JsonRpcSigner;
  account?: string;
  publicKey?: string;
  signature?: string;
  cipher?: string;
  plaintext?: string;
  contractAddress?: string;
  claimAddress?: string;
};

const provider = new Web3Provider(mm, "any");

const initialAppState: AppState = {
  state: State.Connect,
  provider: new Web3Provider(mm, "any"),
  signer: provider.getSigner(),
};

const App = () => {
  const [appState, setAppState] = useState<AppState>(initialAppState);
  const { state, account, publicKey, signer, plaintext, signature } = appState;

  useEffect(() => {
    if (account === undefined || account === null) {
      setAppState((s) => ({ ...s, account: mm.selectedAddress }));
    }
  }, [account]);

  useEffect(() => {
    mm.on("accountsChanged", (accounts: Array<string>) => {
      if (accounts.length > 0) {
        setAppState((s) => ({ ...s, account: accounts[0] }));
      } else {
        setAppState((s) => ({ ...s, account: undefined }));
      }
    });
  }, []);

  useEffect(() => {
    if (signer === undefined || signer === null) {
      setAppState((s) => ({ ...s, signer: provider.getSigner() }));
    }
  }, [provider, signer]);

  const Main = () => {
    return (
      <div className="bg-gray-50 h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto py-24">
            <div className="mb-16 text-center">
              {" "}
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                  className="mx-auto h-12 w-auto"
                  src={logo}
                  alt="Workflow"
                />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Register your account
                  <br />
                  with our service
                </h2>
              </div>
            </div>
            <div className="flex">
              <div className="basis-56">
                <StepComponent appState={appState} />
              </div>
              <div className="flex-1">
                {" "}
                {state === State.Connect && (
                  <>
                    <ConnectShell
                      appState={appState}
                      setAppState={setAppState}
                    />
                  </>
                )}
                {state === State.ReleaseEncryption && (
                  <>
                    <ReleaseShell
                      appState={appState}
                      setAppState={setAppState}
                    />
                  </>
                )}
                {state === State.SignAndRegister && !!publicKey && !!signer && (
                  <Form appState={appState} setAppState={setAppState} />
                )}
                {state === State.Verify && (
                  <>
                    <VerifyShell
                      appState={appState}
                      setAppState={setAppState}
                    />
                  </>
                )}
                {state === State.Complete &&
                  !!plaintext &&
                  !!signature &&
                  !!signer && (
                    <>
                      <CompleteShell
                        appState={appState}
                        setAppState={setAppState}
                      />
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route
        path="/login"
        element={<Login appState={appState} setAppState={setAppState} />}
      />
    </Routes>
  );
};

export default App;
