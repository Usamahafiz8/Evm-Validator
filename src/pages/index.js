import styles from "../styles/Home.module.css";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../components/wallet/connectors";
import TokenList from "../assets/token-list.json";
import Wallets from "../assets/wallet-address.json";
import { useEffect, useState } from "react";
import useBalance from "../actions/useBalance";

export default function Home() {
  const [selectedToken, setSelectedToken] = useState(TokenList[0]);
  const [selectedWallet, setSelectedWallet] = useState(Wallets[0]);

  const { activate, account } = useWeb3React();
  const [checkAccount, setCheckAccount] = useState("");

  useEffect(() => {
    setCheckAccount(selectedWallet.address);
  }, [selectedWallet]);

  
  // useEffect(()=>{
  //   const getElrondBal = async () => {
  //     // const api = 'https://gateway.elrond.com/address/:bech32Address/balance'
  //     const response = await axios.get(`https://gateway.elrond.com/address/${checkAccount}/balance`)
      
  //     console.log("response", response);
  //   }
  //   if (selectedToken.name === 'Elrond'){
  //     console.log("triggered on change elrond");
  //     getElrondBal();
  //   }
  // },[selectedToken, selectedWallet])

  // const accountHandler = (e) => {};
  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(account);
  };
  const [balance] = useBalance(
    selectedToken.address,
    selectedToken.decimals,
    checkAccount,
    selectedToken.name
  );
  console.log("balance ", balance);
  // console.log("checkAccount ", checkAccount);
  // console.log("selectToken", selectedToken);
  // console.log("selectWallet", selectedWallet);
  // console.log("selectWallet", selectedWallet);

  return (
    <div className={styles.container}>
      <div className="block">
        <div>
          <h1>Wallet Balance Checker</h1>
        </div>
        <div className="input-box">
          <button onClick={() => activate(injected)}>Connect to Wallet</button>
          <hr color="green" />
          {account ? (
            <i>Your Wallet : {account}</i>
          ) : (
            <i>No wallet is connected</i>
          )}
          <hr color="green" />
          <br />
          <label>Select Validator Wallet Address :</label>
          <div className="connect-button"></div>
          <form onSubmit={submitHandler}>
            {/* <input value={checkAccount} onChange={accountHandler} type="text" placeholder="0x"/>
            <br /> */}
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
              <option value={index} key={token.address}>
                {token.name}
              </option>
            ))}
          </select>
          <br />
          <label>
            <h2>{`Balance : $${balance}`}</h2>
          </label>
          <br />
        </div>
      </div>
    </div>
  );
}