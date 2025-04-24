import React, { useState, useEffect } from "react";

const TitleDetails = ({ title }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

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

      const url = `https://watchmode.p.rapidapi.com/title/${title.id}/details/?append_to_response=sources`;

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

    if (title && title.id) {
      fetchData();
    } else {
      setError("No title ID provided");
      setLoading(false);
    }
  }, [title, selectedTypes, selectedGenres]); // Re-fetch when title or filters change

  if (loading) {
    return (
      <div className="card shadow-sm mb-3">
        <div className="card-body text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading title details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error loading title details: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            {data && data.poster ? (
              <img
                src={data.poster}
                alt={`${title.title} poster`}
                className="img-fluid rounded"
                style={{
                  maxHeight: "300px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                className="bg-light p-3 d-flex align-items-center justify-content-center"
                style={{ height: "180px", borderRadius: "8px" }}
              >
                <div className="text-center text-muted">
                  <i className="bi bi-film" style={{ fontSize: "3rem" }}></i>
                  <p className="mt-2">Poster not available</p>
                </div>
              </div>
            )}
          </div>

          <div className="col-md-8">
            <h4 className="card-title">
              {title.title} ({title.year || "N/A"})
            </h4>

            <div className="row mb-3">
              <div className="col-6 col-md-4">
                <strong>Type:</strong>{" "}
                <span className="badge bg-primary">{title.type}</span>
              </div>
              {title.imdb_id && (
                <div className="col-6 col-md-4">
                  <strong>IMDb:</strong>{" "}
                  <a
                    href={`https://www.imdb.com/title/${title.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    {title.imdb_id}
                  </a>
                </div>
              )}
              {data && data.user_rating && (
                <div className="col-6 col-md-4">
                  <strong>Rating:</strong>{" "}
                  <span className="badge bg-success">
                    {data.user_rating.toFixed(1)}/10
                  </span>
                </div>
              )}
            </div>

            {data ? (
              <>
                {data.plot_overview && (
                  <div className="mb-3">
                    <h5>Synopsis</h5>
                    <p>{data.plot_overview}</p>
                  </div>
                )}

                <div className="row">
                  {data.runtime_minutes && (
                    <div className="col-md-4 mb-2">
                      <strong>Runtime:</strong> {data.runtime_minutes} min
                    </div>
                  )}
                  {data.release_date && (
                    <div className="col-md-4 mb-2">
                      <strong>Released:</strong>{" "}
                      {new Date(data.release_date).toLocaleDateString()}
                    </div>
                  )}
                  {data.genre_names && data.genre_names.length > 0 && (
                    <div className="col-md-4 mb-2">
                      <strong>Genres:</strong> {data.genre_names.join(", ")}
                    </div>
                  )}
                </div>

                {/* Cast and Crew Section */}
                {data.cast && data.cast.length > 0 && (
                  <div className="mt-3">
                    <h5>Cast</h5>
                    <div className="row">
                      {data.cast.slice(0, 6).map((person, index) => (
                        <div key={index} className="col-md-4 mb-2">
                          {person.name}{" "}
                          {person.character && `as ${person.character}`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Streaming Sources */}
                {data.sources && data.sources.length > 0 && (
                  <div className="mt-3">
                    <h5>Where to Watch</h5>
                    <div className="row">
                      {data.sources.slice(0, 6).map((source, index) => (
                        <div key={index} className="col-md-4 mb-2">
                          <a
                            href={source.web_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            <i className="bi bi-play-circle me-1"></i>
                            {source.name} ({source.type})
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Additional information about this title will be displayed here
                when the API is connected. This could include synopsis, cast,
                ratings, and streaming availability.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleDetails;
