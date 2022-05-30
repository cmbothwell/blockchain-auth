import { ethers } from "ethers";
import { TypedDataField } from "@ethersproject/abstract-signer";
import { Auth } from "./typechain";
import { decrypt } from "./encrypt";
import e from "express";

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

export const recoverLogin = async (
  value: { address: string; date: string },
  signature: string
) => {
  return await ethers.utils.verifyTypedData(
    domain,
    authenticationTypes,
    value,
    signature
  );
};

export const verifyClaim = async (
  contract: Auth,
  claimAddress: string,
  claimantAddress: string,
  claimantPublicKey: string
) => {
  const encryptedClaim = await contract.claims(claimAddress, claimantAddress);
  const { permissions } = decrypt(encryptedClaim, claimantPublicKey);
  if (permissions.pictures) {
    return true;
  } else {
    return false;
  }
};
