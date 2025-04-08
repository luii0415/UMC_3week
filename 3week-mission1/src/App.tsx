import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import HomePage from "./pages/Home";
import MoviesPage from "./pages/Moviepage1";
import NotFoundPage from "./pages/Errorpage";
import MovieDetailPage from "./pages/Moviedetailpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="movies/:category" element={<MoviesPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="movies/:movieId/details" element={<MovieDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
