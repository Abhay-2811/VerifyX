const hre = require("hardhat");

async function main() {

  const Verifyx = await hre.ethers.getContractFactory("VerifyXSBT");
  const verifyx = await Verifyx.deploy();

  await verifyx.deployed();

  console.log(
    `Deployed to ${verifyx.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
