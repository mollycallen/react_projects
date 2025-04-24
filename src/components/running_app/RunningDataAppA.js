import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Container, Card, Form } from "react-bootstrap";

const RunningDataTable = ({ csvData }) => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "Time Period",
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (csvData) {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV data:", error);
        },
      });
    }
  }, [csvData]);

  // Helper to determine if the column contains numbers (with possible commas and units)
  const isNumericColumn = (key) => {
    if (data.length === 0) return false;

    // Check first row's value for this key
    const value = data[0][key];

    // Return true if the column value starts with a digit, possibly followed by units
    return /^[\d,.]+/.test(value.replace(/,/g, ""));
  };

  // Helper to normalize values for proper sorting
  const getNormalizedValue = (value, key) => {
    if (!value) return "";

    // Remove commas from numbers
    value = value.replace(/,/g, "");

    // Extract numeric part from fields with units
    if (key === "Total Distance" || key === "Max Distance") {
      return parseFloat(value.split(" ")[0]);
    }

    // Handle time format (h:m:s)
    if (key === "Total Activity Time") {
      const timeParts = value.split(" ")[0].split(":");
      // Convert to seconds for comparison
      return (
        parseInt(timeParts[0]) * 3600 +
        parseInt(timeParts[1]) * 60 +
        parseInt(timeParts[2])
      );
    }

    // Handle pace format (m:s /mi)
    if (key === "Best Pace") {
      const paceParts = value.split(" ")[0].split(":");
      return parseInt(paceParts[0]) * 60 + parseInt(paceParts[1]);
    }

    // Handle step count
    if (key === "Average Step Count") {
      return parseInt(value);
    }

    // Handle month year format
    if (key === "Time Period") {
      // Assuming format like "Mar 2025"
      const monthMap = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12,
      };
      const [month, year] = value.split(" ");
      return parseInt(year) * 12 + monthMap[month];
    }

    return value;
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!data || data.length === 0) return [];

    // Filter data based on search term
    const filteredData = data.filter((item) =>
      Object.values(item).some((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Sort the filtered data
    const sortableData = [...filteredData];
    sortableData.sort((a, b) => {
      const valueA = getNormalizedValue(a[sortConfig.key], sortConfig.key);
      const valueB = getNormalizedValue(b[sortConfig.key], sortConfig.key);

      if (valueA < valueB) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    return sortableData;
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
  };

  const sortedData = getSortedData();

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h3>My Running Statistics</h3>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>

          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="bg-light">
                <tr>
                  {data.length > 0 &&
                    Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        onClick={() => requestSort(key)}
                        style={{ cursor: "pointer" }}
                        className={
                          sortConfig.key === key ? "bg-light-hover" : ""
                        }
                      >
                        {key}
                        {getSortIndicator(key)}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(row).map((key) => (
                      <td
                        key={`${rowIndex}-${key}`}
                        className={isNumericColumn(key) ? "text-end" : ""}
                      >
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {data.length > 0 && (
            <div className="mt-3 text-muted">
              <small>
                Showing {sortedData.length} of {data.length} entries
              </small>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

// Example usage component with hardcoded CSV data
const RunningDataApp = () => {
  const sampleCsvData = `"Time Period","Activities","Total Distance","Max Distance","Total Activity Time","Best Pace","Average Step Count"
"Mar 2025","19","130.03 mi","10.01 mi","21:29:58 h:m:s","5:48 /mi","11,029"
"Feb 2025","23","156.83 mi","12.13 mi","24:21:00 h:m:s","2:02 /mi","10,913"
"Jan 2025","22","165.74 mi","12.01 mi","25:18:51 h:m:s","6:53 /mi","11,973"
"Dec 2024","24","176.23 mi","12.01 mi","26:35:54 h:m:s","5:48 /mi","11,603"
"Nov 2024","25","179.85 mi","10.53 mi","28:48:18 h:m:s","5:51 /mi","11,490"
"Oct 2024","31","191.11 mi","13.20 mi","29:57:56 h:m:s","5:57 /mi","9,891"
"Sep 2024","25","168.28 mi","12.18 mi","27:16:53 h:m:s","6:13 /mi","10,847"
"Aug 2024","27","180.32 mi","11.22 mi","30:08:58 h:m:s","6:37 /mi","10,730"
"Jul 2024","25","181.17 mi","10.01 mi","30:34:29 h:m:s","6:09 /mi","11,212"
"Jun 2024","24","162.28 mi","10.10 mi","25:12:16 h:m:s","1:37 /mi","10,530"
"May 2024","26","177.94 mi","11.01 mi","26:12:01 h:m:s","6:14 /mi","10,511"
"Apr 2024","22","155.34 mi","10.36 mi","23:20:43 h:m:s","6:00 /mi","10,891"
"Mar 2024","25","171.15 mi","10.01 mi","25:58:38 h:m:s","6:18 /mi","10,769"
"Feb 2024","24","173.42 mi","10.01 mi","25:40:14 h:m:s","1:07 /mi","10,865"
"Jan 2024","24","180.80 mi","10.59 mi","27:09:47 h:m:s","6:30 /mi","11,704"
"Dec 2023","26","196.73 mi","10.80 mi","29:11:01 h:m:s","6:26 /mi","11,676"`;

  return <RunningDataTable csvData={sampleCsvData} />;
};

export default RunningDataApp;
