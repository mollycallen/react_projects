import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

const RunningDataTable = ({ csvData }) => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (csvData) {
      // Parse CSV data
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          setData(results.data);
          setLoading(false);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          setLoading(false);
        },
      });
    }
  }, [csvData]);

  // Function to handle sorting
  const requestSort = (key) => {
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  // Function to get sorting icon
  const getSortIcon = (name) => {
    if (sortConfig.key !== name) {
      return <FontAwesomeIcon icon={faSort} className="ms-1 text-muted" />;
    }

    return sortConfig.direction === "ascending" ? (
      <FontAwesomeIcon icon={faSortUp} className="ms-1" />
    ) : (
      <FontAwesomeIcon icon={faSortDown} className="ms-1" />
    );
  };

  // Convert strings to comparable values for sorting
  const getComparableValue = (value, columnName) => {
    if (!value) return "";

    // Handle different column types
    if (columnName === "Total Distance" || columnName === "Max Distance") {
      return parseFloat(value.replace(" mi", ""));
    } else if (
      columnName === "Activities" ||
      columnName === "Average Step Count"
    ) {
      return parseInt(value.replace(",", ""));
    } else if (columnName === "Total Activity Time") {
      // Convert h:m:s to seconds for comparison
      const [hours, minutes, seconds] = value.replace(" h:m:s", "").split(":");
      return (
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
      );
    } else if (columnName === "Best Pace") {
      // Convert m:s /mi to seconds
      const [minutes, seconds] = value.replace(" /mi", "").split(":");
      return parseInt(minutes) * 60 + parseInt(seconds);
    } else if (columnName === "Time Period") {
      // For time periods like "Mar 2025"
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const [month, year] = value.split(" ");
      return parseInt(year) * 100 + monthNames.indexOf(month);
    }

    return value;
  };

  // Sort the data based on current sort configuration
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !data.length) return data;

    return [...data].sort((a, b) => {
      const aValue = getComparableValue(a[sortConfig.key], sortConfig.key);
      const bValue = getComparableValue(b[sortConfig.key], sortConfig.key);

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return <div className="alert alert-warning">No data available</div>;
  }

  // Get column headers from the first row
  const columnHeaders = Object.keys(data[0]);

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">Running Statistics</h4>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                {columnHeaders.map((header) => (
                  <th
                    key={header}
                    onClick={() => requestSort(header)}
                    className="cursor-pointer"
                    style={{ cursor: "pointer" }}
                  >
                    {header} {getSortIcon(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columnHeaders.map((header, colIndex) => (
                    <td key={`${rowIndex}-${colIndex}`}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sample usage
const RunningDataApp = () => {
  const [csvFile, setCsvFile] = useState(null);

  // Mock data for initial testing
  const sampleCsvData = `"Time Period","Activities","Total Distance","Max Distance","Total Activity Time","Best Pace","Average Step Count"
"Mar 2025","19","130.03 mi","10.01 mi","21:29:58 h:m:s","5:48 /mi","11,029"
"Feb 2025","23","156.83 mi","12.13 mi","24:21:00 h:m:s","2:02 /mi","10,913"
"Jan 2025","22","165.74 mi","12.01 mi","25:18:51 h:m:s","6:53 /mi","11,973"
"Dec 2024","24","176.23 mi","12.01 mi","26:35:54 h:m:s","5:48 /mi","11,603"
"Nov 2024","25","179.85 mi","10.53 mi","28:48:18 h:m:s","5:51 /mi","11,490"
"Oct 2024","31","191.11 mi","13.20 mi","29:57:56 h:m:s","5:57 /mi","9,891"
"Sep 2024","25","168.28 mi","12.18 mi","27:16:53 h:m:s","6:13 /mi","10,847"`;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCsvFile(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h2>Running Data Analyzer</h2>
          <div className="mb-3">
            <label htmlFor="csvFile" className="form-label">
              Upload CSV File
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
      <div className="row">
        <div className="col">
          <RunningDataTable csvData={csvFile || sampleCsvData} />
        </div>
      </div>
    </div>
  );
};

export default RunningDataApp;
