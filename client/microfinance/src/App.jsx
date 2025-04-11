import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Staff from "./staff";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/staff/*" element={<Staff />} />
      </Routes>
    </Router>
  );
};

export default App;
