import React from 'react'
import LandingPage from './Components/LandingPage'
import SignIN from './Components/SignIN.JSX'
import SignUp from './Components/SignUp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './Components/Sidebar'
import TicketDashboard from './Components/TicketDashboard'
import ContactCenter from './Components/ContactCenter';
import { Toaster } from 'sonner';
import Chatbot from './Components/Chatbot'
import TeamPage from './Components/TeamPage'
import RequestFormTable from './Components/RequestFormTable';
import SidebarLayout from './Components/SidebarLayout'
import AnalyticsDashboard from './Components/AnalyticalDashboard'
import AnalyticalDashboard from './Components/AnalyticalDashboard'
import EditProfile from './Components/EditProfile'


const App = () => {
  return (
    <div>
    
        <Routes>
          <Route  path='/' element={<LandingPage/>}/>
          <Route  path='/signin' element={<SignIN/>}/>
          <Route  path='/signup' element={<SignUp/>}/>
          <Route element={<SidebarLayout />}>
        <Route path="/dashboard" element={<TicketDashboard />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/graph" element={<AnalyticalDashboard/>} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/request" element={<RequestFormTable />} />
        <Route path="/ContactCenter" element={<ContactCenter />} />
        <Route path="/update" element={<EditProfile/>}/>
      </Route>





        </Routes>
        <Toaster />
    
    </div>
  )
}

export default App