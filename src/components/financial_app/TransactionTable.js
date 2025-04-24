import React from "react";

const TransactionTable = ({
  transactions,
  filteredTransactions,
  filtersActive,
  sortConfig,
  requestSort,
  formatAmount,
  handlePrint,
}) => {
  // Calculate summary statistics
  const calculateSummary = () => {
    if (!transactions.length) return { count: 0, total: 0, currency: "USD" };

    // Use the appropriate set of transactions based on filter state
    const items = filtersActive ? filteredTransactions : transactions;

    // Group transactions by currency
    const currencyGroups = {};

    items.forEach((transaction) => {
      const currency = transaction.Currency || "USD";
      const amount =
        parseFloat(transaction.Amount.replace(/[^-0-9.]/g, "")) || 0;

      if (!currencyGroups[currency]) {
        currencyGroups[currency] = 0;
      }

      currencyGroups[currency] += amount;
    });

    // For simplicity, we'll just use the first currency found for display
    const primaryCurrency = Object.keys(currencyGroups)[0] || "USD";

    return {
      count: items.length,
      total: formatAmount(
        currencyGroups[primaryCurrency]
          ? currencyGroups[primaryCurrency].toString()
          : "0",
        primaryCurrency
      ),
      currency: primaryCurrency,
      totalCount: transactions.length,
    };
  };

  const getSortedItems = () => {
    if (!transactions.length) return [];

    // Use filtered transactions if filters are active
    const items = filtersActive ? filteredTransactions : transactions;

    return [...items].sort((a, b) => {
      if (sortConfig.key === "Amount") {
        const amountA = parseFloat(a.Amount.replace(/[^-0-9.]/g, "")) || 0;
        const amountB = parseFloat(b.Amount.replace(/[^-0-9.]/g, "")) || 0;
        return sortConfig.direction === "ascending"
          ? amountA - amountB
          : amountB - amountA;
      } else if (sortConfig.key === "Date") {
        // Parse dates in MM/DD/YYYY format
        const datePartsA = a.Date.split("/");
        const datePartsB = b.Date.split("/");

        // Create date objects in format MM/DD/YYYY
        const dateA = new Date(
          parseInt(datePartsA[2]),
          parseInt(datePartsA[0]) - 1,
          parseInt(datePartsA[1])
        );

        const dateB = new Date(
          parseInt(datePartsB[2]),
          parseInt(datePartsB[0]) - 1,
          parseInt(datePartsB[1])
        );

        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      } else {
        // Basic string comparison for other fields
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      }
    });
  };

  const summary = calculateSummary();

  return (
    <>
      <div className="card-body bg-success bg-opacity-10 border border-success rounded-3 shadow-sm mx-3 my-2">
        <div className="d-flex justify-content-between">
          <div className="mb-2">
            <div>
              <span className="fw-bold">Transactions:</span>{" "}
              <span className="text-success fw-bold fs-5">
                {filtersActive ? filteredTransactions.length : summary.count}
              </span>
              {filtersActive && (
                <small className="text-muted ms-2">
                  (filtered from {summary.totalCount})
                </small>
              )}
            </div>

            <div className="mt-2">
              <span className="fw-bold">Net Amount:</span>
              <span
                className={`ms-2 fw-bold font-monospace fs-5 ${
                  parseFloat(summary.total.replace(/[^-0-9.]/g, "")) < 0
                    ? "text-danger"
                    : "text-success"
                }`}
              >
                {summary.total}
              </span>
              {filtersActive && (
                <small className="text-muted d-block">
                  (filtered results only)
                </small>
              )}
            </div>
          </div>

          <div>
            <button
              className="btn btn-success shadow-sm"
              type="button"
              onClick={handlePrint}
              disabled={transactions.length === 0}
            >
              <i className="bi bi-printer me-1"></i> Print
            </button>
          </div>
        </div>
      </div>

      <div className="card-body p-0 mx-3 mb-3">
        <div className="table-responsive border border-secondary rounded-3 shadow-sm">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-light">
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("Date")}
                  className="px-3"
                >
                  Date{" "}
                  {sortConfig.key === "Date" && (
                    <span className="ms-1">
                      {sortConfig.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("Name")}
                  className="px-3"
                >
                  Name{" "}
                  {sortConfig.key === "Name" && (
                    <span className="ms-1">
                      {sortConfig.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="text-end px-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("Amount")}
                >
                  Amount{" "}
                  {sortConfig.key === "Amount" && (
                    <span className="ms-1">
                      {sortConfig.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {getSortedItems().map((transaction, index) => (
                <tr key={index}>
                  <td className="px-3">{transaction.Date}</td>
                  <td className="px-3">{transaction.Name}</td>
                  <td className="text-end px-3 font-monospace">
                    <span
                      className={
                        parseFloat(transaction.Amount) < 0
                          ? "text-danger"
                          : "text-success"
                      }
                    >
                      {formatAmount(transaction.Amount, transaction.Currency)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TransactionTable;
