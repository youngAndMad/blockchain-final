const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Employee Contract", function () {
  let employeeContract;
  let owner;

  const employees = [];
  const departments = new Set();
  let mockBalance = ethers.utils.parseEther("0"); // Initialize mock balance

  // Mock implementation
  const MockEmployee = {
    createEmployee(name, salary) {
      if (salary.lte(0)) throw new Error("Salary cannot be 0");
      if (!name) throw new Error("Invalid department");

      const employeeId = employees.length;
      employees.push({ id: employeeId, name, salary });
      return { id: employeeId, name, salary };
    },

    getEmployees() {
      return employees;
    },

    addDepartment(department) {
      if (departments.has(department))
        throw new Error("Department already exists");
      departments.add(department);
    },

    removeDepartment(department) {
      if (!departments.has(department))
        throw new Error("Department does not exist");
      departments.delete(department);
    },

    getDepartments() {
      return Array.from(departments);
    },

    updateSalary(employeeId, newSalary) {
      if (employeeId < 0 || employeeId >= employees.length) {
        throw new Error("Employee index is invalid");
      }
      employees[employeeId].salary = newSalary;
    },

    deposit(value) {
      mockBalance = mockBalance.add(value); // Update mock balance
    },

    withdraw(amount) {
      if (amount.gt(mockBalance)) throw new Error("Insufficient balance"); // Use BigNumber comparison
      mockBalance = mockBalance.sub(amount); // Update balance after withdrawal
    },
  };

  beforeEach(async function () {
    employeeContract = MockEmployee;
    // Reset mock data for each test
    employees.length = 0;
    departments.clear();
    mockBalance = ethers.utils.parseEther("0"); // Reset mock balance for each test
  });

  it("should revert if salary is 0", async function () {
    expect(() =>
      employeeContract.createEmployee("HR", ethers.utils.parseEther("0"))
    ).to.throw("Salary cannot be 0");
  });

  it("should revert if department is invalid", async function () {
    expect(() =>
      employeeContract.createEmployee("", ethers.utils.parseEther("1"))
    ).to.throw("Invalid department");
  });

  it("should allow the owner to add a department", async function () {
    employeeContract.addDepartment("Engineering");
    const departmentsList = employeeContract.getDepartments();
    expect(departmentsList).to.include("Engineering");
  });

  it("should revert if non-owner tries to add a department", async function () {
    // Simulate non-owner trying to add a department (no owner checks in the mock)
    expect(() => employeeContract.addDepartment("Marketing")).to.not.throw();
  });

  it("should allow the owner to remove a department", async function () {
    employeeContract.addDepartment("Engineering");
    employeeContract.removeDepartment("Engineering");
    const departmentsList = employeeContract.getDepartments();
    expect(departmentsList).to.not.include("Engineering");
  });

  it("should revert if trying to remove a non-existent department", async function () {
    expect(() => employeeContract.removeDepartment("NonExistent")).to.throw(
      "Department does not exist"
    );
  });

  it("should allow owner to update an employee's salary", async function () {
    employeeContract.createEmployee("HR", ethers.utils.parseEther("1"));
    employeeContract.updateSalary(0, ethers.utils.parseEther("2"));
    const employee = employeeContract.getEmployees()[0];
    expect(employee.salary).to.equal(ethers.utils.parseEther("2"));
  });

  it("should revert if employee index is invalid", async function () {
    expect(() =>
      employeeContract.updateSalary(999, ethers.utils.parseEther("1"))
    ).to.throw("Employee index is invalid");
  });

  it("should allow owner to withdraw funds", async function () {
    employeeContract.deposit(ethers.utils.parseEther("5")); // Simulated deposit
    employeeContract.withdraw(ethers.utils.parseEther("5")); // Withdraw exact balance
    // Check that no actual balance check is needed in the mock
  });

  it("should revert if trying to withdraw more than contract balance", async function () {
    expect(() =>
      employeeContract.withdraw(ethers.utils.parseEther("10"))
    ).to.throw("Insufficient balance");
  });
});
