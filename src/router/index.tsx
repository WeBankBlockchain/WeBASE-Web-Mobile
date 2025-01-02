import React, { useEffect } from 'react'
import { useRoutes, useLocation, Navigate } from 'react-router-dom'
import WellcomePage from '../pages/WellcomePage'
import DetailPage from '../pages/DetialPage'
import Guide from '../pages/Guide'

const Routes = () => {
  const location = useLocation()
  const getBastPath = (path: string) => {
    return process.env.PUBLIC_URL + path
  }

  const routes = [
    { path:  getBastPath('/'), element: <WellcomePage /> },
    { path:  getBastPath('/detail'), element: <DetailPage /> },
    { path:  getBastPath('/guide'), element: <Guide />, title: 'Claim NFT' },
    // { path:  "*", element: <Navigate to={ getBastPath('/')} replace /> }
  ]

  useEffect(() => {
    const setTitle = () => {
      const route = routes.find(route => route.path === location.pathname);
      document.title = route?.title || 'Tokenized Symbiotic Orb';
    };

    setTitle();
  }, [location.pathname, routes])

  return useRoutes(routes)
}

export default Routes
