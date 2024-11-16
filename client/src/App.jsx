import { useState, useEffect } from "react";
import abi from "./contractJson/Employee.json";
import { ethers } from "ethers";
import "./App.css";
import LandingPage from "./components/LandingPage";
import TransactionsContext from "./hooks/useTransactions";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFoundPage from "./components/NotFoundPage";

let transactionsState = {
  departmentCreation: false,
  employeeCreation: false,
  salaryUpdate: false,
};

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Event listener for going offline
    const handleOffline = () => {
      setIsOnline(false);
      alert("You are offline. Please check your internet connection.");
    };

    // Event listener for coming back online
    const handleOnline = () => {
      setIsOnline(true);
      alert("You are back online!");
    };

    // Attach event listeners
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [txStatuses, setTxStatutes] = useState(transactionsState);

  const toggleStatus = (fieldName) => {
    console.log(
      "toggle " + fieldName + " current state = " + txStatuses[fieldName]
    );
    setTxStatutes((prevStatuses) => ({
      ...prevStatuses,
      [fieldName]: !prevStatuses[fieldName],
    }));
  };
  const [account, setAccount] = useState("Not connected");
  useEffect(() => {
    const template = async () => {
      const contractAddres = "0xdb1638057E0605aDB69B9EC176D1f283D6FD10c8";
      const contractABI = abi.abi;
      try {
        const { ethereum } = window;
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        setAccount(account);
        const provider = new ethers.providers.Web3Provider(ethereum); //read the Blockchain
        const signer = provider.getSigner(); //write the blockchain

        const contract = new ethers.Contract(
          contractAddres,
          contractABI,
          signer
        );
        console.log(contract);
        contract.on("EmployeeCreated", (data) => {
          alert(`Event from solidity: Employee created ${data} `);
        });
        contract.on("DepartmentAdded", (data) => {
          alert(`Event from solidity: DepartmentAdded ${data} `);
        });
        contract.on("DepartmentRemoved", (data) => {
          alert(`Event from solidity: DepartmentRemoved ${data} `);
        });
        contract.on("SalaryUpdated", (data) => {
          alert(`Event from solidity: SalaryUpdated ${data} `);
        });
        contract.on("FundsWithdrawn", (data) => {
          alert(`Event from solidity: FundsWithdrawn ${data} `);
        });

        setState({ provider, signer, contract });
      } catch (error) {
        if (error.code === -32603) {
          alert("No internet connection");
        }
        console.log(error);
      }
    };
    template();
  }, []);
  return (
    <TransactionsContext.Provider
      value={{ txStatuses, setTxStatutes, toggleStatus }}
    >
      <Router>
        <div>
          <Routes>
            <Route
              path="/"
              element={<LandingPage state={state} account={account} />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </TransactionsContext.Provider>
  );
}

export default App;
