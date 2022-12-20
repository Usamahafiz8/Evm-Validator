import { useState, useEffect } from "react";
import { ZERO_ADDRESS, web3BNToFloatString } from "../utils";
import { getERC20Contract } from "../store/contractStore";
import BigNumber from "bignumber.js";
import BN from "bn.js";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { GetUSDExchangeRate, GetETHExchangeRate } from "../assets/api";

export default function useBalance(tokenAddress, decimals, checkAccount, name) {
  // console.log(library);
  const [balance, setBalance] = useState("0");
  const [usdExRate, setUsdExRate] = useState();
  // const [ethExRate, setEthExRate] = useState();

  const getElrondBal = async () => {
    await axios.get(
      `https://gateway.elrond.com/address/${checkAccount}/balance`
    ).then(response => {
      console.log("response", response);
      const egldBal = response.data.data.balance;
      console.log("elrond bal", egldBal);
      setBalance(egldBal);
    }).catch(err => {
      console.log(err);
    })
  };
  useEffect(() => {
    GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
      console.log("usd", parseFloat(res));
    });
    // GetETHExchangeRate().then((res) => {
    //   setEthExRate(parseFloat(res));
    //   console.log("eth", parseFloat(res));
    // });
  }, []);

  useEffect(() => {
    if (name === "Elrond" && tokenAddress !== ZERO_ADDRESS) {
      console.log("triggered on change elrond");
      getElrondBal();
    }
  }, [checkAccount, name]);

  const { account, library } = useWeb3React();

  useEffect(() => {
    let isCancelled = false;

    function getBalance() {
      // console.log(library);
      return new Promise((resolve) => {
        if (!library || !tokenAddress) {
          resolve(new BN("0"));
          return;
        }

        try {
          if (tokenAddress === ZERO_ADDRESS) {
            // console.log("running zero address with account ", checkAccount);

            library.eth
              .getBalance(checkAccount)
              .then((value) => {
                resolve(new BN(value));
              })
              .catch((error) => {
                console.log(error);
                resolve(new BN("0"));
              });
          } else {
            // console.log("running token address");
            const contract = getERC20Contract(
              tokenAddress,
              library,
              checkAccount
            );
            contract?.methods
              .balanceOf(account)
              .call()
              .then((value) => {
                resolve(new BN(value));
              })
              .catch((error) => {
                console.log(error);
                resolve(new BN("0"));
              });
          }
        } catch (error) {
          resolve(new BN("0"));
        }
      });
    }

    async function run() {
      const bn = await getBalance();
      if (!isCancelled) {
        const pow = new BigNumber("10").pow(new BigNumber(decimals));
        const b = web3BNToFloatString(bn, pow, 4, BigNumber.ROUND_DOWN);
        // console.log("eth value", usdExRate);
        const dollarBalance = b * usdExRate;
        setBalance(dollarBalance);
      }
    }

    run();

    return () => {
      isCancelled = true;
    };
  }, [tokenAddress, library, decimals, account, checkAccount, usdExRate]);
  // console.log("library", library);
  // console.log("decimal", decimals);
  // console.log("account", account);
  // console.log("tokenAddress", tokenAddress);

  return [balance];
}
