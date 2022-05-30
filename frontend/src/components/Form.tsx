import React, { useState } from "react";
import { AppState, State } from "../App";
import { Claim, sign } from "../Sign";

const URL = "http://localhost:8000/register";

const postData = async (
  url: string,
  data: {
    claim: Claim;
    claimantAddress: string;
    publicKey: string;
    signature: string;
  }
) => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  return response.json();
};

const Form = ({
  appState,
  setAppState,
}: {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}) => {
  const { signer, publicKey } = appState;
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  const onSubmit = async () => {
    if (!!signer && !!publicKey) {
      const claim: Claim = {
        subject: { email, name },
        permissions: { pictures: true },
      };

      const signerAddress = await signer.getAddress();
      const signature = await sign(signer, claim);

      const { contractAddress, claimAddress } = await postData(URL, {
        claim,
        claimantAddress: signerAddress,
        publicKey,
        signature,
      });

      setAppState((s) => ({
        ...s,
        signature,
        contractAddress,
        claimAddress,
        state: State.Verify,
      }));
    }
  };

  return (
    <>
      <div className="min-h-full flex flex-col justify-begin">
        <div className="sm:w-full sm:max-w-lg">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    placeholder="your.email@example.com"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    type="text"
                    placeholder="Name"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  onClick={onSubmit}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Sign Registration Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
