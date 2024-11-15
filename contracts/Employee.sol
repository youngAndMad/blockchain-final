// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Employee {
    struct Memo {
        string name;
        string message;
        uint timestamp;
        address from;
    }

    struct Department {
        string name;
    }

    struct Employee {
        string name;
        uint salary;
        string department;
        uint timestamp;
    }

    // Events
    event EmployeeCreated(
        string name,
        string department,
        uint salary,
        uint timestamp
    );
    event DepartmentAdded(string departmentName);
    event DepartmentRemoved(string departmentName);
    event SalaryUpdated(string employeeName, uint oldSalary, uint newSalary);
    event FundsWithdrawn(address owner, uint amount);

    Department[] departments;
    Memo[] memos;
    Employee[] employees;

    address payable owner; //owner is going to receive funds

    constructor() {
        owner = payable(msg.sender);
        departments.push(Department("IT"));
        departments.push(Department("Math"));
        departments.push(Department("Sport"));
        departments.push(Department("History"));
    }

    // Modifier to check only owner can call certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function createEmployee(
        string calldata name,
        string calldata department,
        uint salary
    ) external payable {
        require(msg.value > 0, "Please pay more than 0 ether");
        require(salary > 0, "Salary must be greater than 0");
        require(isValidDepartment(department), "Invalid department");

        employees.push(Employee(name, salary, department, block.timestamp));
        emit EmployeeCreated(name, department, salary, block.timestamp);
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function getEmployees() public view returns (Employee[] memory) {
        return employees;
    }

    function getDepartment() public view returns (Department[] memory) {
        return departments;
    }

    function addDepartment(string calldata name) external onlyOwner {
        require(bytes(name).length > 0, "Department name cannot be empty");
        departments.push(Department(name));
        emit DepartmentAdded(name);
    }

    function removeDepartment(string calldata name) external onlyOwner {
        require(isValidDepartment(name), "Invalid department");
        for (uint i = 0; i < departments.length; i++) {
            if (
                keccak256(bytes(departments[i].name)) == keccak256(bytes(name))
            ) {
                // Shift elements and remove the department
                departments[i] = departments[departments.length - 1];
                departments.pop();
                emit DepartmentRemoved(name);
                break;
            }
        }
    }

    function updateSalary(
        uint employeeIndex,
        uint newSalary
    ) external onlyOwner {
        require(employeeIndex < employees.length, "Invalid employee index");
        require(newSalary > 0, "New salary must be greater than 0");

        Employee storage employee = employees[employeeIndex];
        uint oldSalary = employee.salary;
        employee.salary = newSalary;

        emit SalaryUpdated(employee.name, oldSalary, newSalary);
    }

    function withdrawFunds(uint amount) external onlyOwner {
        require(
            amount <= address(this).balance,
            "Insufficient contract balance"
        );
        owner.transfer(amount);
        emit FundsWithdrawn(owner, amount);
    }

    // Helper function to validate if a department exists
    function isValidDepartment(
        string memory departmentName
    ) internal view returns (bool) {
        for (uint i = 0; i < departments.length; i++) {
            if (
                keccak256(bytes(departments[i].name)) ==
                keccak256(bytes(departmentName))
            ) {
                return true;
            }
        }
        return false;
    }
}
