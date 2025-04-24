import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import TransactionFilter from "./TransactionFilter";
import TransactionTable from "./TransactionTable";

const PaypalTransactionViewer = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filtersActive, setFiltersActive] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "Date",
    direction: "descending",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      setError(null);

      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (
            results.errors.length > 0 &&
            results.errors.some((e) => e.code !== "TooFewFields")
          ) {
            setError("Error parsing CSV file: " + results.errors[0].message);
          } else {
            // Filter out empty rows and rows without essential data
            const validTransactions = results.data.filter(
              (item) => item.Date && item.Name && item.Amount
            );
            setTransactions(validTransactions);
          }
          setIsLoading(false);
        },
        error: (error) => {
          setError("Error reading file: " + error.message);
          setIsLoading(false);
        },
      });
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (filtered, active) => {
    setFilteredTransactions(filtered);
    setFiltersActive(active);
  };

  const handlePrint = () => {
    window.print();
  };

  // Format currency amount based on Currency field
  const formatAmount = (amount, currency = "USD") => {
    if (!amount) return "$0.00";

    const numAmount = parseFloat(amount.replace(/[^-0-9.]/g, "")) || 0;
    if (isNaN(numAmount)) return amount;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(numAmount);
  };

  // Add print styles
  useEffect(() => {
    // Create a style element for print styles
    const styleElement = document.createElement("style");
    styleElement.setAttribute("type", "text/css");
    styleElement.setAttribute("id", "print-styles");

    // Add print-specific CSS rules
    styleElement.textContent = `
      @media print {
        /* Hide non-essential elements during print */
        header, .btn, #csvFile, label[for="csvFile"], .collapse:not(.show),
        .d-print-none, .card-header, .table th[style*="cursor: pointer"] span {
          display: none !important;
        }
        
        /* Format print page */
        .container {
          width: 100%;
          max-width: 100%;
          padding: 0;
          margin: 0;
        }
        
        /* Remove shadows and most borders */
        .card, .shadow, .border {
          box-shadow: none !important;
          border: none !important;
        }
        
        /* Keep important borders */
        .table, .table td, .table th, .border-bottom {
          border-color: #dee2e6 !important;
        }
        
        /* Add page title */
        .card-body.bg-success {
          background-color: white !important;
          border: 1px solid #28a745 !important;
          border-radius: 0 !important;
          margin: 0 0 20px 0 !important;
          padding: 10px !important;
        }
        
        /* Other formatting */
        .table { width: 100% !important; }
        .table td, .table th { padding: 5px 10px !important; }
        body { font-size: 12pt; }
        h2 { font-size: 18pt; }
        
        /* Add header before table */
        .table-responsive::before {
          content: "PayPal Transaction Report";
          display: block;
          font-size: 18pt;
          font-weight: bold;
          margin-bottom: 10px;
          text-align: center;
        }
      }
    `;

    // Add the style to the document head
    document.head.appendChild(styleElement);

    // Cleanup function
    return () => {
      const element = document.getElementById("print-styles");
      if (element) {
        document.head.removeChild(element);
      }
    };
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Sticky Header */}
      <header className="sticky-top bg-white border-bottom shadow-sm">
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="text-primary mb-0">PayPal Transaction Viewer</h1>
            </div>
            <div className="col-md-6">
              <div className="mt-3 mt-md-0">
                <label htmlFor="csvFile" className="form-label">
                  Upload PayPal CSV File
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="csvFile"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-4 flex-grow-1">
        {error && (
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Processing your transactions...</p>
          </div>
        )}

        {/* Content area with border and shadow */}
        <div className="card border shadow">
          {!isLoading && transactions.length === 0 && !error && (
            <div className="card-body text-center py-5">
              <div className="alert alert-info d-inline-block" role="alert">
                <h4 className="alert-heading">No transactions to display</h4>
                <p className="mb-0">
                  Upload a PayPal CSV file to view your transactions.
                </p>
              </div>
            </div>
          )}

          {!isLoading && transactions.length > 0 && (
            <>
              <TransactionFilter
                transactions={transactions}
                onFilterChange={handleFilterChange}
              />

              <TransactionTable
                transactions={transactions}
                filteredTransactions={filteredTransactions}
                filtersActive={filtersActive}
                sortConfig={sortConfig}
                requestSort={requestSort}
                formatAmount={formatAmount}
                handlePrint={handlePrint}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaypalTransactionViewer;
