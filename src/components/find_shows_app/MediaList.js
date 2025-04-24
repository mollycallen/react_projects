import React, { useState, useEffect } from "react";
import { typeOptions, genreOptions, renderType } from "./utilsB";
import TitleDetails from "./TitleDetails";

// Define CSS for animations
const styles = {
  fadeIn: {
    animation: "fadeIn 0.3s ease-in-out",
  },
  detailsContainer: {
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  hoverEffect: {
    transition: "background-color 0.2s ease",
  },
};

// CSS animation definitions
const animationCSS = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Add the animation CSS to the document
const addAnimationStyles = () => {
  if (!document.getElementById("media-list-animations")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "media-list-animations";
    styleSheet.textContent = animationCSS;
    document.head.appendChild(styleSheet);
  }
};

const MediaList = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "ascending",
  });

  // State for filters
  const [selectedTypes, setSelectedTypes] = useState(["movie", "tv_series"]);
  const [selectedGenres, setSelectedGenres] = useState(["5"]); // Default genre: Crime

  // State to track expanded title detail
  const [expandedTitleId, setExpandedTitleId] = useState(null);

  // Initialize animation styles
  useEffect(() => {
    addAnimationStyles();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!process.env.REACT_APP_RAPIDAPI_KEY) {
        setError("API key not configured");
        setLoading(false);
        return;
      }

      // Build the type parameter (comma-separated types)
      const typesParam = selectedTypes.join(",");

      // Build the genres parameter (comma-separated genre IDs)
      const genresParam = selectedGenres.join(",");

      const url =
        "https://watchmode.p.rapidapi.com/list-titles/" +
        `?types=${encodeURIComponent(typesParam)}` +
        "&regions=US" +
        "&source_types=sub%2Cfree" +
        "&source_ids=26" +
        "&page=1" +
        "&limit=250" +
        `&genres=${genresParam}` +
        "&sort_by=relevance_desc" +
        "&release_date_start=20100097";

      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
          "x-rapidapi-host":
            process.env.REACT_APP_RAPIDAPI_HOST || "watchmode.p.rapidapi.com",
        },
      };

      setLoading(true);
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTypes, selectedGenres]); // Re-fetch when filters change

  const handleTypeChange = (e) => {
    // For multi-select, we need to handle the selected options
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedTypes(selectedOptions);
  };

  const handleGenreChange = (e) => {
    // For multi-select, we need to handle the selected options
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedGenres(selectedOptions);
  };

  const sortData = (items, key, direction) => {
    return [...items].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      // Convert to strings for comparison if they're not numbers
      if (key !== "year") {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (direction === "ascending") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return "↕️";
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  const renderSortableHeader = (key, label) => (
    <th
      className="cursor-pointer"
      onClick={() => handleSort(key)}
      style={{ cursor: "pointer" }}
    >
      {label} {getSortIcon(key)}
    </th>
  );

  // We're now importing renderType from utils.js

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error fetching data: {error}
      </div>
    );
  }

  const sortedData = data?.titles
    ? sortData(data.titles, sortConfig.key, sortConfig.direction)
    : [];

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Movies and TV Series</h1>

      {/* Filter Controls */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <label htmlFor="typeFilter" className="form-label">
            Content Type
          </label>
          <select
            id="typeFilter"
            className="form-select"
            multiple
            value={selectedTypes}
            onChange={handleTypeChange}
            size={5} // Show 5 options at once
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <small className="text-muted">
            Hold Ctrl/Cmd to select multiple types
          </small>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="genreFilter" className="form-label">
            Genres
          </label>
          <select
            id="genreFilter"
            className="form-select"
            multiple
            value={selectedGenres}
            onChange={handleGenreChange}
            size={10} // Show 10 options at once
          >
            {genreOptions.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          <small className="text-muted">
            Hold Ctrl/Cmd to select multiple genres
          </small>
        </div>
      </div>

      {sortedData.length > 0 ? (
        <div
          className="table-responsive"
          style={{ height: "500px", overflowY: "auto" }}
        >
          <table className="table table-striped table-hover">
            <thead
              className="table-dark"
              style={{ position: "sticky", top: 0, zIndex: 1 }}
            >
              <tr>
                {renderSortableHeader("title", "Title")}
                {renderSortableHeader("year", "Year")}
                {renderSortableHeader("type", "Type")}
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => {
                const isExpanded = expandedTitleId === item.id;

                return (
                  <React.Fragment key={item.id}>
                    <tr
                      className={isExpanded ? "table-active" : ""}
                      style={styles.hoverEffect}
                    >
                      <td>{item.title}</td>
                      <td>{item.year || "N/A"}</td>
                      <td>{renderType(item.type)}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${
                            isExpanded
                              ? "btn-outline-danger"
                              : "btn-outline-primary"
                          }`}
                          onClick={() =>
                            setExpandedTitleId(isExpanded ? null : item.id)
                          }
                        >
                          {isExpanded ? (
                            <>
                              <i className="bi bi-chevron-up me-1"></i>
                              Hide
                            </>
                          ) : (
                            <>
                              <i className="bi bi-chevron-down me-1"></i>
                              Details
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan="4" className="p-0 border-0">
                          <div
                            className="bg-light p-3 rounded mx-2 mb-3 shadow-sm"
                            style={{
                              ...styles.fadeIn,
                              ...styles.detailsContainer,
                            }}
                          >
                            <TitleDetails title={item} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted">No data available for the selected filters</p>
      )}
    </div>
  );
};

export default MediaList;
