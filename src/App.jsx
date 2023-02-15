import { Route, Routes, Link } from "react-router-dom";
import New from "./routes/new";
import Old from "./routes/old";

export default function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">OLD</Link>
          </li>
          <li>
            <Link to="/new">NEW</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Old />} />
        <Route path="/new" element={<New />} />
      </Routes>
    </>
  );
}
