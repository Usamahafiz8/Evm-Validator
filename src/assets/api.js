export const getUsdExchangeRate = async () => {
  var requestOptions = { method: "GET", redirect: "follow" };
  return fetch(
    "https://api.coinbase.com/v2/exchange-rates?currency=ETH",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return result.data.rates.USD;
    })
    .catch((error) => {
      return "error", error;
    });
};

export const getEthExchangeRate = async () => {
  var requestOptions = { method: "GET", redirect: "follow" };
  return fetch(
    "https://api.coinbase.com/v2/exchange-rates?currency=USD",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return result.data.rates.ETH;
    })
    .catch((error) => {
      return "error", error;
    });
};

export const getEgldExchangeRate = async () => {

  var requestOptions = { method: "GET", redirect: "follow" };
  return fetch(
    "https://api.coinbase.com/v2/exchange-rates?currency=EGLD",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return result.data.rates.USD;
    })
    .catch((error) => {
      return "error", error;
    });
};

export const getTonExchangeRate = async () => {

  var requestOptions = { method: "GET", redirect: "follow" };
  return fetch(
    "https://api.coinbase.com/v2/exchange-rates?currency=TON",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return result.data.rates.USD;
    })
    .catch((error) => {
      return "error", error;
    });
};

export const getScrtExchangeRate = async () => {

  var requestOptions = { method: "GET", redirect: "follow" };
  return fetch(
    "https://api.binance.com/api/v3/ticker/price?symbol=SCRTUSDT",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return result.price;
    })
    .catch((error) => {
      return "error", error;
    });
};
