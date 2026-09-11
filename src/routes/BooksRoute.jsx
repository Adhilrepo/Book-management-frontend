import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { BooksPage } from "../pages/BooksPage";

export default function BooksRoute() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/books" element={<BooksPage />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}