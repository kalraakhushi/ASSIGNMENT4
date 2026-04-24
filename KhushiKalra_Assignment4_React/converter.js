import React, { useState, useEffect, useMemo } from "react";

const API_URL = "https://api.frankfurter.app/latest";

function Converter() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrencies([data.base, ...Object.keys(data.rates)]);
      })
      .catch(() => setError("⚠️ Failed to fetch currency list."));
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency && amount > 0) {
      fetch(`${API_URL}?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => {
          setResult(data.rates[toCurrency]);
        })
        .catch(() => setError("⚠️ Failed to fetch exchange rate."));
    }
  }, [fromCurrency, toCurrency, amount]);

  const conversionText = useMemo(() => {
    if (!result) return "—";
    return `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
  }, [result, amount, fromCurrency, toCurrency]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Currency Converter</h2>
      
      {error && <p style={styles.error}>{error}</p>}

      {/* Currency Selection */}
      <div style={styles.row}>
        <select style={styles.dropdown} value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>

        <span style={styles.arrow}>➡️</span>

        <select style={styles.dropdown} value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
      </div>

      {/* Amount Input */}
      <input
        style={styles.input}
        type="number"
        value={amount}
        min="1"
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Converted Output */}
      <div style={styles.resultBox}>
        <h3>{conversionText}</h3>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#f9f9f9",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    margin: "20px auto",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    color: "#333",
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  dropdown: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    flex: 1,
    margin: "0 5px",
  },
  arrow: {
    fontSize: "20px",
    margin: "0 10px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginBottom: "20px",
  },
  resultBox: {
    background: "#4CAF50",
    color: "white",
    padding: "15px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "18px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
};

export default React.memo(Converter);