// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Employee Contract", function () {
//   let employeeContract;
//   let owner;
//   let addr1;
//   let addr2;

//   beforeEach(async function () {
//     [owner, addr1, addr2] = await ethers.getSigners();

//     const Employee = await ethers.getContractFactory("Employee");
//     employeeContract = await Employee.deploy();
//     await employeeContract.deployed();
//   });

//   describe("Deployment", function () {
//     it("Should set the right owner", async function () {
//       expect(await employeeContract.owner()).to.equal(owner.address);
//     });

//     it("Should initialize with predefined departments", async function () {
//       const departments = await employeeContract.getDepartment();
//       expect(departments.length).to.equal(4);
//       expect(departments[0].name).to.equal("IT");
//     });
//   });

//   describe("createEmployee", function () {
//     it("Should create an employee when valid inputs are provided", async function () {
//       const tx = await employeeContract.createEmployee("Alice", "IT", 1000, {
//         value: ethers.utils.parseEther("1"),
//       });

//       const employees = await employeeContract.getEmployees();
//       expect(employees.length).to.equal(1);
//       expect(employees[0].name).to.equal("Alice");
//     });

//     it("Should emit EmployeeCreated event on employee creation", async function () {
//       await expect(
//         employeeContract.createEmployee("Alice", "IT", 1000, {
//           value: ethers.utils.parseEther("1"),
//         })
//       )
//         .to.emit(employeeContract, "EmployeeCreated")
//         .withArgs("Alice", "IT", 1000, anyUint); // using a helper to match any uint for timestamp
//     });

//     it("Should revert if the salary is zero", async function () {
//       await expect(
//         employeeContract.createEmployee("Alice", "IT", 0, {
//           value: ethers.utils.parseEther("1"),
//         })
//       ).to.be.revertedWith("Salary must be greater than 0");
//     });

//     it("Should revert if the payment is zero", async function () {
//       await expect(
//         employeeContract.createEmployee("Alice", "IT", 1000, {
//           value: ethers.utils.parseEther("0"),
//         })
//       ).to.be.revertedWith("Please pay more than 0 ether");
//     });
//   });

//   describe("buyChai", function () {
//     it("Should allow a user to buy chai with a valid message", async function () {
//       await employeeContract
//         .connect(addr1)
//         .buyChai("Bob", "Great job", { value: ethers.utils.parseEther("0.1") });

//       const memos = await employeeContract.getMemos();
//       expect(memos.length).to.equal(1);
//       expect(memos[0].name).to.equal("Bob");
//       expect(memos[0].message).to.equal("Great job");
//     });

//     it("Should revert if the payment is zero", async function () {
//       await expect(
//         employeeContract.connect(addr1).buyChai("Bob", "Great job", {
//           value: ethers.utils.parseEther("0"),
//         })
//       ).to.be.revertedWith("Please pay more than 0 ether");
//     });
//   });

//   describe("Departments", function () {
//     it("Should allow the owner to add a department", async function () {
//       await employeeContract.addDepartment("Physics");
//       const departments = await employeeContract.getDepartment();
//       expect(departments.length).to.equal(5);
//     });

//     it("Should emit DepartmentAdded event when a department is added", async function () {
//       await expect(employeeContract.addDepartment("Physics"))
//         .to.emit(employeeContract, "DepartmentAdded")
//         .withArgs("Physics");
//     });

//     it("Should allow the owner to remove a department", async function () {
//       await employeeContract.removeDepartment("Math");
//       const departments = await employeeContract.getDepartment();
//       expect(departments.length).to.equal(3);
//     });

//     it("Should emit DepartmentRemoved event when a department is removed", async function () {
//       await expect(employeeContract.removeDepartment("Math"))
//         .to.emit(employeeContract, "DepartmentRemoved")
//         .withArgs("Math");
//     });

//     it("Should revert if a non-owner tries to add a department", async function () {
//       await expect(
//         employeeContract.connect(addr1).addDepartment("Physics")
//       ).to.be.revertedWith("Only owner can call this function");
//     });
//   });

//   describe("updateSalary", function () {
//     beforeEach(async function () {
//       await employeeContract.createEmployee("Alice", "IT", 1000, {
//         value: ethers.utils.parseEther("1"),
//       });
//     });

//     it("Should allow the owner to update salary", async function () {
//       await employeeContract.updateSalary(0, 2000);

//       const employees = await employeeContract.getEmployees();
//       expect(employees[0].salary).to.equal(2000);
//     });

//     it("Should emit SalaryUpdated event when salary is updated", async function () {
//       await expect(employeeContract.updateSalary(0, 2000))
//         .to.emit(employeeContract, "SalaryUpdated")
//         .withArgs("Alice", 1000, 2000);
//     });

//     it("Should revert if non-owner tries to update salary", async function () {
//       await expect(
//         employeeContract.connect(addr1).updateSalary(0, 2000)
//       ).to.be.revertedWith("Only owner can call this function");
//     });
//   });

//   describe("withdrawFunds", function () {
//     it("Should allow owner to withdraw funds", async function () {
//       await employeeContract.buyChai("Bob", "Great work", {
//         value: ethers.utils.parseEther("1"),
//       });

//       const initialBalance = await ethers.provider.getBalance(owner.address);

//       await employeeContract.withdrawFunds(ethers.utils.parseEther("1"));

//       const finalBalance = await ethers.provider.getBalance(owner.address);
//       expect(finalBalance).to.be.above(initialBalance);
//     });

//     it("Should revert if non-owner tries to withdraw", async function () {
//       await expect(
//         employeeContract
//           .connect(addr1)
//           .withdrawFunds(ethers.utils.parseEther("1"))
//       ).to.be.revertedWith("Only owner can call this function");
//     });

//     it("Should revert if withdrawing more than balance", async function () {
//       await expect(
//         employeeContract.withdrawFunds(ethers.utils.parseEther("10"))
//       ).to.be.revertedWith("Insufficient contract balance");
//     });
//   });
// });
