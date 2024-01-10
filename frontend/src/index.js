import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GeneralHeader from "./components/GeneralHeader";
import Profile from "./pages/ProfilePage";
import Login from "./pages/LoginPage";
import SearchResults from "./pages/SearchResultsPage";
import CareerStoryDetail from "./pages/CareerStoryDetailPage";
import TopPage from "./pages/TopPage";
import Page404 from "./pages/Page404"; 

const router = createBrowserRouter([
  {
    path: '/',
    element: <GeneralHeader />,
    errorElement: <Page404 />,
    children: [
      {
        index: true,
        element: <TopPage />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/results',
        element: <SearchResults />,
      },
      {
        path: '/detail',
        element: <CareerStoryDetail />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
