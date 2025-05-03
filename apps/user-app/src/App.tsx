import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import ProtectedRoute from './pages/ProtectedRoute'
import { UserProvider } from './atoms/usecontext'
import Transactions from './pages/Transactions'
import Wallet from './pages/Wallet'

function App() {

  return (
    <UserProvider>  {/* Wrap everything in the UserProvider */}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/withdraw" element={<Wallet />} />
        <Route path="/transactions" element={
          <ProtectedRoute>
          <Transactions />
            </ProtectedRoute>
          } />
        <Route path="/"
         element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>
    </UserProvider>
  )
}

export default App
