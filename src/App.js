import './App.css';

import { useRoutes } from 'react-router';

import Catalog from './pages/Catalog';
import Shoes from './pages/Shoes';
const routes = [
  { path: '/', element: <Catalog /> },
  { path: '/shoes/:id', element: <Shoes />}
];

import globalStyles from './css/global.module.css'

function App() {
  const elements = useRoutes(routes);
  return (
    <div>
      {elements}
    </div>
  );
}

export default App;
