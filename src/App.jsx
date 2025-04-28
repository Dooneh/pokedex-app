import { Routes, Route, Link } from 'react-router-dom';
import PokemonDetail from './pages/PokemonDetail';




function App() {
  return (
    <div>
      <Routes>
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </div>
  );
}

export default App;
