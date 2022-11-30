import styles from "../styles/Home.module.css";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../components/wallet/connectors";
import TokenList from "../assets/token-list.json";
import { useState } from "react";
import useBalance from "../actions/useBalance";

export default function Home() {
  const [selectedToken, setSelectedToken] = useState(TokenList[0]);

  const { activate, account } = useWeb3React();
  const [checkAccount, setCheckAccount] = useState("");

  const accountHandler = (e) => {
    setCheckAccount(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(account);
  };
  const [balance] = useBalance(
    selectedToken.address,
    selectedToken.decimals,
    checkAccount
  );
  console.log("balance ", balance);
  console.log("balance ", balance);

  return (
    <div className={styles.container}>
      <div className="block">
        <div>
          <h1>Wallet Balance Checker</h1>
        </div>
        <div className="connect-button"></div>
        <div className="input-box">
          <label>Enter Wallet Address :</label>
          <form onSubmit={submitHandler}>
            <input value={account} onChange={accountHandler} type="text" />
          </form>

          <br />
          <label>Select the Token</label>
          <select onChange={(e) => setSelectedToken(TokenList[e.target.value])}>
            {TokenList.map((token, index) => (
              <option value={index} key={token.address}>
                {token.name}
              </option>
            ))}
          </select>
          <br />
          <label> Balance : {balance}</label>
          <br />
          <hr color="black" />
          <button onClick={() => activate(injected)}>Connect to Wallet</button>

          {account ? `Connected wallet: ${account}` : "Wallet not connected"}
        </div>
      </div>
    </div>
  );
}
