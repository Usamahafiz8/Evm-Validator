import { useState, useEffect } from "react";
import { ZERO_ADDRESS, web3BNToFloatString } from "../utils";
import { getERC20Contract } from "../store/contractStore";
import BigNumber from "bignumber.js";
import BN from "bn.js";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import {
  getUsdExchangeRate,
  getEgldExchangeRate,
  getTonExchangeRate,
  getScrtExchangeRate,
} from "../assets/api";

export default function useBalance(
  tokenAddress,
  decimals,
  checkAccount,
  symbol
) {
  const [balance, setBalance] = useState(0);
  const [ethExRate, setEthExRate] = useState(0);
  const [egldExRate, setEgldExRate] = useState(0);
  const [tonExRate, setTonExRate] = useState(0);
  const [scrtExRate, setScrtExRate] = useState(0);
  const { account, library } = useWeb3React();

  const getEthBalance = async () => {

    function getBalance() {
      return new Promise((resolve) => {
        if (!library || !tokenAddress) {
          resolve(new BN("0"));
          return;
        }

        try {
          if (tokenAddress === ZERO_ADDRESS) {
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
    const ethBlnc = await getBalance();
    const pow = new BigNumber("10").pow(new BigNumber(decimals));
    const decimalBal = web3BNToFloatString(
      ethBlnc,
      pow,
      4,
      BigNumber.ROUND_DOWN
    );
    const convertedBalance = decimalBal * ethExRate;
    setBalance(convertedBalance);
  };

  const getScrtBal = async () => {
    await axios
      .get(
        `https://proxy.atomscan.com/secret-lcd/cosmos/bank/v1beta1/balances/${checkAccount}`
      )
      .then((response) => {
        const len = response.data.balances.length - 1;
        const scrtBal = response.data.balances[len].amount;
        const pow = new BigNumber("10").pow(new BigNumber(decimals));
        const decimalBalance = web3BNToFloatString(
          scrtBal,

          pow,
          4,
          BigNumber.ROUND_DOWN
        );
        const convertedBalance = decimalBalance * scrtExRate;
        setBalance(convertedBalance);
      })
      .catch((err) => {
        console.log(err);
        setBalance(0);
      });
  };

  const getTonBal = async () => {
    await axios
      .get(
        `https://toncenter.com/api/v2/getAddressBalance?address=${checkAccount}`
      )
      .then((response) => {
        const tonBal = response.data.result;
        const pow = new BigNumber("10").pow(new BigNumber(decimals));
        const decimalBalance = web3BNToFloatString(
          tonBal,
          pow,
          4,
          BigNumber.ROUND_DOWN
        );
        const convertedBalance = decimalBalance * tonExRate;
        setBalance(convertedBalance);
      })
      .catch((err) => {
        console.log(err);
        setBalance(0);
      });
  };

  const getElrondBal = async () => {
    await axios
      .get(`https://gateway.elrond.com/address/${checkAccount}/balance`)
      .then((response) => {
        const egldBal = response.data.data.balance;
        const pow = new BigNumber("10").pow(new BigNumber(decimals));
        const decimalBalance = web3BNToFloatString(
          egldBal,
          pow,
          4,
          BigNumber.ROUND_DOWN
        );
        const convertedBalance = decimalBalance * egldExRate;
        setBalance(convertedBalance);
      })
      .catch((err) => {
        console.log(err);
        setBalance(0);
      });
  };

  useEffect(() => {
    getUsdExchangeRate().then((res) => {
      setEthExRate(parseFloat(res));
      // console.log("usd", parseFloat(res));
    });
    getEgldExchangeRate().then((res) => {
      setEgldExRate(parseFloat(res));
      // console.log("eth", parseFloat(res));
    });
    getTonExchangeRate().then((res) => {
      setTonExRate(parseFloat(res));
      // console.log("eth", parseFloat(res));
    });
    getScrtExchangeRate().then((res) => {
      setScrtExRate(parseFloat(res));
      // console.log("eth", parseFloat(res));
    });
  }, []);

  useEffect(() => {
    if (symbol === "ETH") {
      getEthBalance();
    }
  }, [
    tokenAddress,
    library,
    account,
    decimals,
    checkAccount,
    symbol,
    ethExRate,
  ]);

  useEffect(() => {
    if (symbol === "SCRT") {
      getScrtBal();
    }
  }, [decimals, checkAccount, symbol, scrtExRate]);

  useEffect(() => {
    if (symbol === "TON") {
      getTonBal();
    }
  }, [decimals, checkAccount, symbol, tonExRate]);

  useEffect(() => {
    if (symbol === "EGLD") {
      getElrondBal();
    }
  }, [decimals, checkAccount, symbol, egldExRate]);

  return [balance];
}
