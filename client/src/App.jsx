import { useState, useEffect } from "react";
import abi from "./contractJson/Employee.json";
import { ethers } from "ethers";
import "./App.css";
import LandingPage from "./components/LandingPage";
import TransactionsContext from "./hooks/useTransactions";

const transactionsState = {
  departmentCreation: false,
  employeeCreation: false,
  salaryUpdate: false,
};

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [txStatuses, setTxStatutes] = useState(transactionsState);

  const [account, setAccount] = useState("Not connected");
  useEffect(() => {
    const template = async () => {
      const contractAddres = "0xdb1638057E0605aDB69B9EC176D1f283D6FD10c8";
      const contractABI = abi.abi;
      //Metamask part
      //1. In order do transactions on goerli testnet
      //2. Metmask consists of infura api which actually help in connectig to the blockhain
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
        console.log(error);
      }
    };
    template();
  }, []);
  return (
    <TransactionsContext.Provider value={{ txStatuses, setTxStatutes }}>
      <div>
        <LandingPage state={state} account={account} />
      </div>
    </TransactionsContext.Provider>
  );
}

export default App;
