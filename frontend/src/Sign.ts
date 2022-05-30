import { TypedDataField } from "@ethersproject/abstract-signer";
import { JsonRpcSigner } from "@ethersproject/providers";
import { ethers } from "ethers";

export type Domain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
};

export type Claim = {
  subject: {
    email: string;
    name: string;
  };
  permissions: {
    pictures: boolean;
  };
};

export type Authentication = {
  address: string;
  date: string;
};

// All properties on a domain are optional
export const domain: Domain = {
  name: "Claim Demo",
  version: "1",
  chainId: 31337,
  verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC", // Okay for demo implementation, not verified chain-side
};

// The named list of all type definitions
export const claimTypes: Record<string, TypedDataField[]> = {
  Subject: [
    { name: "email", type: "string" },
    { name: "name", type: "string" },
  ],
  Permissions: [{ name: "pictures", type: "bool" }],
  Claim: [
    { name: "subject", type: "Subject" },
    { name: "permissions", type: "Permissions" },
  ],
};

// The named list of all type definitions
const authenticationTypes: Record<string, TypedDataField[]> = {
  Authentication: [
    { name: "address", type: "string" },
    { name: "date", type: "string" },
  ],
};

export const sign = async (signer: JsonRpcSigner, value: Claim) => {
  return await signer._signTypedData(domain, claimTypes, value);
};

export const verify = async (value: Claim, signature: string) => {
  return await ethers.utils.verifyTypedData(
    domain,
    claimTypes,
    value,
    signature
  );
};

export const signAddress = async (signer: JsonRpcSigner) => {
  const address = await signer.getAddress();
  const date = Date.now().toString();

  const signature = await signer._signTypedData(domain, authenticationTypes, {
    address,
    date,
  });

  return { address, date, signature };
};
