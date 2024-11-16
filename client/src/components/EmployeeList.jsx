import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import "./EmployeeList.css";
import TransactionsContext from "../hooks/useTransactions";

Modal.setAppElement("#root");

// todo: wait during tx
const Employees = ({ state }) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isDepartmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [isEmployeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [isUpdateSalaryModalOpen, setUpdateSalaryModalOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    salary: "",
    department: "",
  });
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);
  const [updatedSalary, setUpdatedSalary] = useState("");
  const { txStatuses, toggleStatus } = useContext(TransactionsContext);

  useEffect(() => {
    const load = async () => {
      try {
        const { contract } = state;

        if (contract !== null) {
          let list = await contract.getEmployees();
          setEmployees(list);
          let deptList = await contract.getDepartment();
          console.log(deptList);
          setDepartments(deptList);
        }
      } catch (e) {
        console.error(e);
        if (e.code === -32603) {
          alert("No internet connection!!!");
        }
      }
    };
    load();
  }, [state]);

  const handleCreateDepartment = async () => {
    const { contract } = state;
    if (newDepartment && contract !== null) {
      if (txStatuses.departmentCreation === true) {
        console.log("Department creation does not finished. Please wait!!!");
        return;
      }

      toggleStatus("departmentCreation");

      await contract.addDepartment(newDepartment);

      toggleStatus("departmentCreation");

      setDepartments([...departments, { name: newDepartment }]);
      setDepartmentModalOpen(false);
      setNewDepartment("");
    }
  };

  const handleCreateEmployee = async () => {
    const { contract } = state;
    if (
      newEmployee.name &&
      newEmployee.salary &&
      newEmployee.department &&
      contract !== null
    ) {
      console.log(txStatuses);
      if (txStatuses.employeeCreation === true) {
        alert("Employee already creating. Please wait!!!");
        return;
      }

      toggleStatus("employeeCreation");

      await contract.createEmployee(
        newEmployee.name,
        newEmployee.department,
        parseInt(newEmployee.salary, 10),
        {
          value: 1, // assuming minimum ether requirement to create an employee
        }
      );
      toggleStatus("employeeCreation");

      let list = await contract.getEmployees();
      setEmployees(list);
      setEmployeeModalOpen(false);
      setNewEmployee({ name: "", salary: "", department: "" });
    }
  };

  const handleUpdateSalary = async () => {
    const { contract } = state;
    if (selectedEmployeeIndex !== null && updatedSalary && contract !== null) {
      await contract.updateSalary(
        selectedEmployeeIndex,
        parseInt(updatedSalary, 10)
      );
      let list = await contract.getEmployees();
      setEmployees(list);
      setUpdateSalaryModalOpen(false);
      setUpdatedSalary("");
      setSelectedEmployeeIndex(null);
    }
  };

  return (
    <div className="employee-list-container">
      <h2 className="employee-list-header">Employee List</h2>

      {state.contract && (
        <div className="button-group">
          <button className="btn" onClick={() => setDepartmentModalOpen(true)}>
            Create Department
          </button>
          <button className="btn" onClick={() => setEmployeeModalOpen(true)}>
            Create Employee
          </button>
        </div>
      )}

      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Salary</th>
            <th>Department</th>
            <th>Created Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <tr key={index}>
                <td>{employee.name}</td>
                <td>
                  {employee.salary.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td>{employee.department}</td>
                <td>
                  {new Date(
                    employee.timestamp?.toNumber() * 1000
                  ).toLocaleString()}
                </td>
                <td>
                  {state.contract && (
                    <button
                      className="btn-small"
                      onClick={() => {
                        setSelectedEmployeeIndex(index);
                        setUpdateSalaryModalOpen(true);
                      }}
                    >
                      Update Salary
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Department Creation */}
      <Modal
        isOpen={isDepartmentModalOpen}
        onRequestClose={() => setDepartmentModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="modal-title">Create Department</h2>
        <input
          className="modal-input"
          type="text"
          placeholder="Department Name"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn" onClick={handleCreateDepartment}>
            Submit
          </button>
          <button
            className="btn btn-cancel"
            onClick={() => setDepartmentModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Modal for Employee Creation */}
      <Modal
        isOpen={isEmployeeModalOpen}
        onRequestClose={() => setEmployeeModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="modal-title">Create Employee</h2>
        <input
          className="modal-input"
          type="text"
          placeholder="Employee Name"
          value={newEmployee.name}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, name: e.target.value })
          }
        />
        <input
          className="modal-input"
          type="number"
          placeholder="Salary"
          value={newEmployee.salary}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, salary: e.target.value })
          }
        />
        <select
          className="modal-input"
          value={newEmployee.department}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, department: e.target.value })
          }
        >
          <option value="">Select Department</option>
          {departments.map((department, index) => (
            <option key={index} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>
        <div className="modal-actions">
          <button className="btn" onClick={handleCreateEmployee}>
            Submit
          </button>
          <button
            className="btn btn-cancel"
            onClick={() => setEmployeeModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Modal for Updating Salary */}
      <Modal
        isOpen={isUpdateSalaryModalOpen}
        onRequestClose={() => setUpdateSalaryModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="modal-title">Update Salary</h2>
        <input
          className="modal-input"
          type="number"
          placeholder="New Salary"
          value={updatedSalary}
          onChange={(e) => setUpdatedSalary(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn" onClick={handleUpdateSalary}>
            Submit
          </button>
          <button
            className="btn btn-cancel"
            onClick={() => setUpdateSalaryModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Employees;
