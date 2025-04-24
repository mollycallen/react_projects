import React, { createContext, useState, useMemo } from "react";
import "./App.css";
import Calculator from "./components/calculator_app/Calculator";
import ModalComponent from "./components/ModalComponent";
import Stopwatch from "./components/stopwatch_app/Stopwatch";
import Form from "react-bootstrap/Form";
import Timer from "./components/timer_app/Timer";
import ProjectManager from "./components/project_manager_app/ProjectManager";
import Blackjack from "./components/card_game_app/Blackjack";
import CSVAnalyzer from "./components/data_analysis_app/CVSUploader";
import WeatherApp from "./components/weather_app/WeatherApp";
import FlashcardManager from "./components/flashcard_app/FlashcardManager";
import Board from "./components/sudoku_app/Board";
import MediaList from "./components/find_shows_app/MediaList";

import StarRating from "./components/StarRating";
import RunningDataApp from "./components/running_app/RunningDataAppB";
import PaypalTransactionViewer from "./components/financial_app/PaypalTransactionView";
export const ThemeContext = createContext();

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const themeContextValue = useMemo(
    () => ({
      darkMode,
      textColor: darkMode ? "text-light" : "text-dark",
      bgColor: darkMode ? "bg-dark" : "bg-light",
    }),
    [darkMode]
  );

  return (
    <div
      className={`${themeContextValue.bgColor} ${themeContextValue.textColor} d-flex flex-column align-items-center justify-content-center p-4`}
    >
      <ThemeContext.Provider value={themeContextValue}>
        {/*         <h1 className="mb-4">Utilities</h1>
        <Form className="mb-4">
          <Form.Check
            type="switch"
            id="dark-mode-switch"
            label={`${darkMode ? "Dark" : "Light"} Mode`}
            checked={darkMode}
            onChange={toggleDarkMode}
          />
        </Form>
        <div className="d-flex flex-column gap-3">
          <ModalComponent title="Calculator" BodyComponent={Calculator} />
          <ModalComponent title="Stopwatch" BodyComponent={Stopwatch} />
          <ModalComponent title="Timer" BodyComponent={Timer} />
          <ModalComponent
            title="Project Manager"
            BodyComponent={ProjectManager}
          />
          <ModalComponent title="Blackjack" BodyComponent={Blackjack} />
          <ModalComponent title="Weather App" BodyComponent={WeatherApp} />
          <ModalComponent
            title="Flashcard Manager"
            BodyComponent={FlashcardManager}
          />
          <ModalComponent title="CSV Analyzer" BodyComponent={CSVAnalyzer} />

          <ModalComponent title="Sudoku" BodyComponent={Board} />
        </div>
        <div className="p-3 m-3">
          <StarRating rating={3.5} />
        </div>
        <MediaList />
        <RunningDataApp /> */}
        <PaypalTransactionViewer />
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
