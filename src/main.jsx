import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OwnerDashboard from './OwnerDashboard.jsx'
import HomePage from './HomePage.jsx'
import NivaasApp from './NivaasApp_Complete2.jsx';
import PropertyDetail from './PropertyDetail.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NivaasApp />
  </StrictMode>,
)
