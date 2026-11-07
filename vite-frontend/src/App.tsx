import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AnimeDetail from './pages/AnimeDetail';
import CharacterDetail from './pages/CharacterDetail';
import PersonDetail from './pages/PersonDetail';
import StudioDetail from './pages/StudioDetail';
import SearchResults from './pages/SearchResults';
import AnimeList from './pages/AnimeList';
import CharacterList from './pages/CharacterList';
import PeopleList from './pages/PeopleList';
import StudioList from './pages/StudioList';
import Schedule from './pages/Schedule';

import MangaList from './pages/MangaList';
import MangaDetail from './pages/MangaDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="anime" element={<AnimeList />} />
          <Route path="anime/:id" element={<AnimeDetail />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="manga" element={<MangaList />} />
          <Route path="manga/:id" element={<MangaDetail />} />
          <Route path="characters" element={<CharacterList />} />
          <Route path="character/:id" element={<CharacterDetail />} />
          <Route path="people" element={<PeopleList />} />
          <Route path="person/:id" element={<PersonDetail />} />
          <Route path="studios" element={<StudioList />} />
          <Route path="studio/:id" element={<StudioDetail />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="seasonal" element={<SearchResults isSeasonal />} />
          <Route path="top" element={<SearchResults isTop />} />
        </Route>
      </Routes>
    </Router>
  );
}
