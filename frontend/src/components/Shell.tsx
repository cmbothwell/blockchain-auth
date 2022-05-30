import { verify } from "../Sign";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppState, State } from "../App";
import { Auth__factory } from "../typechain";

export const ConnectShell = ({
  appState,
  setAppState,
}: {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}) => {
  const { provider } = appState;
  const connect = async () => {
    const accounts = await provider.send("eth_requestAccounts", []);
    setAppState({
      ...appState,
      account: accounts[0],
      signer: provider.getSigner(),
      state: State.ReleaseEncryption,
    });
  };

  return (
    <div className="bg-white shadow sm:rounded-lg max-w-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Connect Wallet
        </h3>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-gray-500">
            <p>
              The first step is to connect your browser wallet to the
              application by clicking this button
            </p>
          </div>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
            <button
              type="button"
              onClick={connect}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReleaseShell = ({
  appState,
  setAppState,
}: {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}) => {
  const { account, provider } = appState;

  const getPublicKey = async () => {
    console.log("Requesting Key on Account", account);
    const publicKey: string = await provider.send(
      "eth_getEncryptionPublicKey",
      [account]
    );

    setAppState((s) => ({
      ...s,
      publicKey: publicKey,
      state: State.SignAndRegister,
    }));
  };

  return (
    <div className="bg-white shadow sm:rounded-lg max-w-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Release Encryption Key
        </h3>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-gray-500">
            <p>
              Now we request your public encryption key - your data is encrypted
              so only you and the server can decrypt it
            </p>
          </div>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
            <button
              type="button"
              onClick={getPublicKey}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
            >
              Release Encryption Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VerifyShell = ({
  appState,
  setAppState,
}: {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}) => {
  const { provider, account, signer, contractAddress, claimAddress, cipher } =
    appState;

  const getChainCipher = async () => {
    if (!!signer && !!contractAddress && !!claimAddress) {
      const signerAddress = await signer.getAddress();
      const contract = Auth__factory.connect(contractAddress, signer);
      const cipher = await contract.claims(claimAddress, signerAddress);

      setAppState((s) => ({ ...s, cipher }));
    }
  };

  const decrypt = async () => {
    if (!!cipher) {
      // This line retrieves the decrypted values from the browser wallet
      const plaintext = await provider.send("eth_decrypt", [cipher, account]);
      setAppState((s) => ({ ...s, plaintext, state: State.Complete }));
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg max-w-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Verify Your On-Chain Data
        </h3>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="w-full text-sm text-gray-500 rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
            <p className="text-sm font-medium text-gray-900 break-words max-w-full">
              {cipher !== undefined ? cipher : "Querying..."}
            </p>
          </div>
        </div>
        <div className="mt-5 sm:flex-shrink-0 sm:flex sm:items-center justify-end">
          {!!cipher ? (
            <button
              type="button"
              onClick={decrypt}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
            >
              Decrypt &amp; Verify
            </button>
          ) : (
            <button
              type="button"
              onClick={getChainCipher}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
            >
              Query Chain Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const CompleteShell = ({
  appState,
  setAppState,
}: {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}) => {
  const { signer, plaintext, signature } = appState;
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const getVerification = async () => {
      if (!!signer && !!plaintext && !!signature) {
        const thisAddress = await signer.getAddress();
        const signatureAddress = await verify(JSON.parse(plaintext), signature);

        setVerified(thisAddress === signatureAddress);
      }
    };

    getVerification();
  }, [signer, plaintext, signature, setVerified]);

  return (
    <div className="bg-white shadow sm:rounded-lg max-w-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Decrypted Data
          </h3>
          {verified !== null ? (
            verified === true ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                Signature Verified
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
                Bad Signature
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            )
          ) : (
            <></>
          )}
        </div>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="w-full text-sm text-gray-500 rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
            <pre className=" text-sm font-medium text-gray-900 max-w-full break-words text-ellipsis overflow-hidden">
              <code>
                {!!plaintext && JSON.stringify(JSON.parse(plaintext), null, 4)}
              </code>
            </pre>
          </div>
        </div>
        <Link to={"/login"}>
          <div className="flex">
            <div className="mt-8 ml-auto mr-0 text-sm text-gray-600 hover:text-gray-800">
              Login &rarr;
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
