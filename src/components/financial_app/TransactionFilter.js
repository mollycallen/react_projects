import React, { useState, useEffect } from "react";

const TransactionFilter = ({ transactions, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    nameSearch: "",
    minAmount: "",
    maxAmount: "",
  });
  const [filtersActive, setFiltersActive] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Apply filters whenever transactions or filters change
  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  // Apply filters to transactions
  const applyFilters = () => {
    if (!transactions.length) {
      setFilteredTransactions([]);
      setFiltersActive(false);
      onFilterChange([], false);
      return;
    }

    let results = [...transactions];
    let active = false;

    // Date From filter
    if (filters.dateFrom) {
      active = true;
      const fromDate = new Date(filters.dateFrom);
      results = results.filter((item) => {
        const dateParts = item.Date.split("/");
        const itemDate = new Date(
          parseInt(dateParts[2]),
          parseInt(dateParts[0]) - 1,
          parseInt(dateParts[1])
        );
        return itemDate >= fromDate;
      });
    }

    // Date To filter
    if (filters.dateTo) {
      active = true;
      const toDate = new Date(filters.dateTo);
      results = results.filter((item) => {
        const dateParts = item.Date.split("/");
        const itemDate = new Date(
          parseInt(dateParts[2]),
          parseInt(dateParts[0]) - 1,
          parseInt(dateParts[1])
        );
        return itemDate <= toDate;
      });
    }

    // Name search filter
    if (filters.nameSearch) {
      active = true;
      const searchTerm = filters.nameSearch.toLowerCase();
      results = results.filter((item) =>
        item.Name.toLowerCase().includes(searchTerm)
      );
    }

    // Min Amount filter
    if (filters.minAmount) {
      active = true;
      const min = parseFloat(filters.minAmount);
      results = results.filter((item) => {
        const amount = parseFloat(item.Amount.replace(/[^-0-9.]/g, "")) || 0;
        return amount >= min;
      });
    }

    // Max Amount filter
    if (filters.maxAmount) {
      active = true;
      const max = parseFloat(filters.maxAmount);
      results = results.filter((item) => {
        const amount = parseFloat(item.Amount.replace(/[^-0-9.]/g, "")) || 0;
        return amount <= max;
      });
    }

    setFiltersActive(active);
    setFilteredTransactions(results);
    onFilterChange(results, active);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      nameSearch: "",
      minAmount: "",
      maxAmount: "",
    });
  };

  return (
    <>
      {/* Using style attribute to ensure no bottom border */}
      <div className="card-header bg-white" style={{ borderBottom: "none" }}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="form-check form-switch me-2">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="filterToggle"
                checked={showFilters}
                onChange={() => setShowFilters(!showFilters)}
                style={{ cursor: "pointer" }}
              />
              <label
                className="form-check-label user-select-none"
                htmlFor="filterToggle"
                style={{ cursor: "pointer" }}
              >
                {showFilters ? "Hide" : "Show"} Filters
              </label>
            </div>

            {filtersActive && (
              <span className="badge bg-primary me-2">Active</span>
            )}

            {filtersActive && (
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fixed height container to prevent layout jumping */}
      <div
        style={{
          maxHeight: showFilters ? "1000px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out", // Faster animation
          position: "relative",
          borderTop: "none", // Explicitly remove top border
        }}
      >
        <div className="card-body bg-secondary bg-opacity-10 border border-secondary rounded-3 shadow-sm mx-3 mt-0 mb-3">
          <h5 className="card-title mb-3">Filter Transactions</h5>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="row g-3">
                <div className="col-6">
                  <label htmlFor="dateFrom" className="form-label">
                    Date From
                  </label>
                  <div className="input-group">
                    <input
                      type="date"
                      className="form-control"
                      id="dateFrom"
                      name="dateFrom"
                      value={filters.dateFrom}
                      onChange={handleFilterChange}
                    />
                    {filters.dateFrom && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            dateFrom: "",
                          }));
                        }}
                        aria-label="Clear from date"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="dateTo" className="form-label">
                    Date To
                  </label>
                  <div className="input-group">
                    <input
                      type="date"
                      className="form-control"
                      id="dateTo"
                      name="dateTo"
                      value={filters.dateTo}
                      onChange={handleFilterChange}
                    />
                    {filters.dateTo && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            dateTo: "",
                          }));
                        }}
                        aria-label="Clear to date"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="nameSearch" className="form-label">
                Search by Name
              </label>
              <input
                type="search"
                className="form-control"
                id="nameSearch"
                name="nameSearch"
                placeholder="Search for merchant or description..."
                value={filters.nameSearch}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-6">
              <div className="row g-3">
                <div className="col-6">
                  <label htmlFor="minAmount" className="form-label">
                    Min Amount
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="minAmount"
                      name="minAmount"
                      placeholder="Min"
                      value={filters.minAmount}
                      onChange={handleFilterChange}
                    />
                    {filters.minAmount && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            minAmount: "",
                          }));
                        }}
                        aria-label="Clear minimum amount"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="maxAmount" className="form-label">
                    Max Amount
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="maxAmount"
                      name="maxAmount"
                      placeholder="Max"
                      value={filters.maxAmount}
                      onChange={handleFilterChange}
                    />
                    {filters.maxAmount && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            maxAmount: "",
                          }));
                        }}
                        aria-label="Clear maximum amount"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            {filtersActive && filteredTransactions.length === 0 && (
              <div className="alert alert-warning mb-0">
                <span className="fw-bold">No matches found!</span> Try adjusting
                your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionFilter;
