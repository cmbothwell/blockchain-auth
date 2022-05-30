import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { encrypt } from "./encrypt";
import { ethers, Wallet } from "ethers";
import { Auth__factory } from "./typechain";
import { verifyClaim, recoverLogin } from "./verify";
import { img } from "./image";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const privateKey: string = process.env.PRIVATE_KEY!;
const contractAddress: string = process.env.CONTRACT_ADDRESS!;

app.use(express.json());
app.use(cors());

const provider = new ethers.providers.JsonRpcProvider();
const signer = new Wallet(privateKey, provider);
const contract = Auth__factory.connect(contractAddress, signer);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/login", async (req: Request, res: Response) => {
  const { address, date, publicKey, signature } = req.body;
  const verifiedAddress = await recoverLogin({ address, date }, signature);

  if (address !== verifiedAddress) {
    res.status(403).send("Not Authorized");
  }

  const hasPermission = await verifyClaim(
    contract,
    signer.address,
    address,
    publicKey
  );

  if (!hasPermission) {
    res.status(403).send("Not Authorized");
  }

  res.send({ content: img });
});

app.post("/register", async (req: Request, res: Response) => {
  const { claim, claimantAddress, publicKey, signature } = req.body;

  const encrypted = encrypt({
    publicKey,
    data: JSON.stringify({ ...claim, signature: signature }),
    version: "x25519-xsalsa20-poly1305",
  });

  const hexEncrypted = JSON.stringify(encrypted)
    .split("")
    .map((c) => c.charCodeAt(0).toString(16))
    .join("");

  const cipher = `0x${hexEncrypted}`;

  const setClaim = await contract.setClaim(claimantAddress, cipher);
  await setClaim.wait();

  res.send({
    contractAddress,
    claimAddress: signer.address,
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: My Server is running at https://localhost:${port}`);
});
