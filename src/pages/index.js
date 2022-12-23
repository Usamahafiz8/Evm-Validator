import styles from "../styles/Home.module.css";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../components/wallet/connectors";
import TokenList from "../assets/token-list.json";
import Wallets from "../assets/wallet-address.json";
import { useEffect, useState } from "react";
import useBalance from "../actions/useBalance";

export default function Home() {
  const [selectedToken, setSelectedToken] = useState(TokenList[1]);
  const [selectedWallet, setSelectedWallet] = useState(Wallets[0]);

  const { activate, account } = useWeb3React();
  const [checkAccount, setCheckAccount] = useState("");

  useEffect(() => {
    setCheckAccount(selectedWallet.address);
  }, [selectedWallet]);

  const submitHandler = (e) => {
    e.preventDefault();
  };
  const [balance] = useBalance(
    selectedToken.address,
    selectedToken.decimals,
    checkAccount,
    selectedToken.symbol,
    selectedWallet.name
  );

  return (
    <div className={styles.container}>
      <div className="block">
        <div>
          <h1>Wallet Balance Checker</h1>
        </div>
        <div className="input-box">
          <button onClick={() => activate(injected)}>Connect to Wallet</button>
          <hr className={account ? "isValid" : "isNotValid"} />
          {account ? (
            <i>
              Your Wallet :{" "}
              <i className={account ? "isValid" : "isNotValid"}>{account}</i>
            </i>
          ) : (
            <i className={account ? "isValid" : "isNotValid"}>
              No Wallet is connected
            </i>
          )}
          <hr className={account ? "isValid" : "isNotValid"} />
          <label>Select Validator Wallet Address :</label>
          <form onSubmit={submitHandler}>
            <select
              onChange={(e) => setSelectedWallet(Wallets[e.target.value])}
            >
              {Wallets.map((wallet, index) => (
                <option value={index} key={wallet.address}>
                  {wallet.name}
                </option>
              ))}
            </select>
          </form>
          <br />
          <label>Select the Token</label>
          <select onChange={(e) => setSelectedToken(TokenList[e.target.value])}>
            {TokenList.map((token, index) => (
              <option value={index} key={token.address} selected={token.name === "Ethereum"}>
                {token.name}
              </option>
            ))}
          </select>
          <br />
          <label>
            <h2>{`Balance : $${balance}`}</h2>
          </label>
          <span className={balance ? "isValid" : "isNotValid"}>
            {balance ? "Address matched." : "Please select the correct token."}
          </span>
        </div>
      </div>
    </div>
  );
}
