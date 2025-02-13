import { defaultAbiCoder } from "ethers/lib/utils";
import { task } from "hardhat/config";
import { deployViaFactory } from "./EIP2470";

const ZeroHash =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const AddressOne = "0x0000000000000000000000000000000000000001";

task("deploy:mastercopy", "Deploys and verifies Roles mastercopy").setAction(
  async (_, hre) => {
    const [deployer] = await hre.ethers.getSigners();

    const salt = ZeroHash;

    const Packer = await hre.ethers.getContractFactory("Packer");
    const packerLibraryAddress = await deployViaFactory(
      Packer.bytecode,
      salt,
      deployer,
      "Packer",
      2000000
    );

    const Integrity = await hre.ethers.getContractFactory("Integrity");
    const integrityLibraryAddress = await deployViaFactory(
      Integrity.bytecode,
      salt,
      deployer,
      "Integrity",
      2000000
    );

    const Roles = await hre.ethers.getContractFactory("Roles", {
      libraries: {
        Integrity: integrityLibraryAddress,
        Packer: packerLibraryAddress,
      },
    });

    const args = defaultAbiCoder.encode(
      ["address", "address", "address"],
      [AddressOne, AddressOne, AddressOne]
    );

    const rolesAddress = await deployViaFactory(
      `${Roles.bytecode}${args.substring(2)}`,
      salt,
      deployer,
      "Roles Mastercopy",
      6000000
    );

    if (hre.network.name == "hardhat") {
      return;
    }

    console.log("Waiting 1 minute before etherscan verification start...");
    // Etherscan needs some time to process before trying to verify.
    await new Promise((resolve) => setTimeout(resolve, 60000));

    await hre.run("verify:verify", {
      address: packerLibraryAddress,
      constructorArguments: [],
    });

    await hre.run("verify:verify", {
      address: integrityLibraryAddress,
      constructorArguments: [],
    });

    await hre.run("verify:verify", {
      address: rolesAddress,
      constructorArguments: [AddressOne, AddressOne, AddressOne],
    });
  }
);
