import { useEffect, useState } from "react";
import { signAddress } from "./Sign";
import { AppState } from "./App";
import logo from "./logo.svg";

const URL = "http://localhost:8000/login";

const postLogin = async (
  url: string,
  data: {
    address: string;
    date: string;
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

const Login = ({
  appState,
  setAppState,
}: {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}) => {
  const { account, provider, signer, publicKey } = appState;
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    const setup = async () => {
      if (signer === undefined) {
        setAppState({ ...appState, signer: provider.getSigner() });
      }

      if (account === undefined) {
        const accounts = await provider.send("eth_requestAccounts", []);
        const account = accounts[0];
        setAppState((v) => ({ ...v, account }));
      }
    };

    setup();
  }, [signer, account]);

  const requestContent = async () => {
    let freshPublicKey: string | undefined = publicKey;

    if (freshPublicKey === undefined) {
      freshPublicKey = await provider.send("eth_getEncryptionPublicKey", [
        account,
      ]);

      setAppState((v) => ({ ...v, publicKey: freshPublicKey }));
    }

    if (signer !== undefined && freshPublicKey !== undefined) {
      const { address, date, signature } = await signAddress(signer);
      const { content } = await postLogin(URL, {
        address,
        date,
        publicKey: freshPublicKey,
        signature,
      });
      setContent(content);
    }
  };

  return (
    <div className="bg-gray-50 h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto py-24">
          <div className="mb-16 text-center">
            {" "}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <img className="mx-auto h-12 w-auto" src={logo} alt="Workflow" />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {content === null && (
                  <>
                    Click to Login &amp; Access
                    <br />
                    Protected Content
                  </>
                )}
                {content !== null && <>The Protected Content</>}
              </h2>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {content === null && (
              <button
                type="button"
                onClick={() => requestContent()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
              >
                Sign In
              </button>
            )}
            {content !== null && <img src={content} alt="The Matterhorn" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
