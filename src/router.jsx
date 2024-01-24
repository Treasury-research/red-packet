import { createBrowserRouter } from 'react-router-dom';
import Root from '@/pages/Root';
import Home from '@/pages/Home';
import Send from '@/pages/Send';
import Claim from '@/pages/Claim';
import BindAddress from '@/pages/BindAddress';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/send', element: <Send /> },
      { path: '/claim', element: <Claim /> },
      { path: '/bind-address', element: <BindAddress /> },
    ],
  },
]);
