import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import ArticlePage from './pages/Article';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categories/:category" element={<CategoryPage />} />
        <Route path="/articles/:id" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
