## Running the Application

In order to run the application, there are a few steps that need to be taken:

#### Start the Local Blockchain

First, navigate to the chain folder.

```
cd chain
```

Then install the required packages with:

```
yarn
```

Now you can start the local test blockchain with:

```
yarn hardhat node
```

Thereafter, open a second terminal, navigate back to the `chain` directory, and deploy the smart contracts with:

```
yarn hardhat run ./scripts/deploy.ts
```

You should see the deployment succeed in the blockchain process' output.

#### Run the Server Process

From the project directory, navigate to the server folder.

```
cd server
```

You will need to ensure the following environment variables are correctly set. You may use a .env file.

```
PORT=8000
PUBLIC_KEY=<Insert Public Key>
PRIVATE_KEY=<Insert Private Key>
CONTRACT_ADDRESS=<Insert Contract Address>
```

The key values are used by the server to represent the server's account on the blockchain. You can use some of the initial values provided by the hardhat local blockchain for testing.

The run:

```
yarn dev
```

You should see the server process start right up.

#### Run the Client

Finally, we need to run the client. Navigate to the client directory from the project root.

```
cd frontend
```

Once again run:

```
yarn
```

and then:

```
yarn dev
```

The application should begin running on your localhost. You can now access it in your browser. Be sure to have Metamask installed in order to view the application.

Note: If you get to the decryption step and you're not seeing the values you expect, this is a known issue with Metamask reading stale data from the blockchain (even locally!). To fix, simply toggle the network to mainnet, and then toggle it back to localhost. This usually fixes the problem
