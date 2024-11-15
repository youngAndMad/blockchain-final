const hre = require("hardhat");

async function main() {
  const Employee = await hre.ethers.getContractFactory("Employee"); //fetching bytecode and ABI
  const employee = await Employee.deploy(); //creating an instance of our smart contract

  await employee.deployed(); //deploying your smart contract

  console.log("Deployed contract address:", `${employee.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//0xa64e3144835aF8781c750ceC432784a68d883266
