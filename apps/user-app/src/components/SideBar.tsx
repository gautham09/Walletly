// components/Sidebar/Sidebar.js
import { Link,useNavigate } from 'react-router-dom';
import { useUser } from '../atoms/usecontext';

export default function SideBar() {
  const {user, signOut} = useUser();
    const navigate = useNavigate();
  
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-5">
      {/* <div className="text-2xl font-bold mb-10">
        Walletly
      </div> */}
      <nav className="flex flex-col gap-4">
        <Link to="/" className="hover:bg-gray-700 p-2 rounded">Dashboard</Link>
        {/* <Link to="/withdraw" className="hover:bg-gray-700 p-2 rounded">Withdraw</Link> */}
        <Link to="/withdraw" className="hover:bg-gray-700 p-2 rounded">Wallet</Link>

        {/* <Link to="/deposit" className="hover:bg-gray-700 p-2 rounded">➕ Deposit</Link> */}
        <Link to="/transactions" className="hover:bg-gray-700 p-2 rounded">Transactions</Link>
        {/* <Link to="/settings" className="hover:bg-gray-700 p-2 rounded">Settings</Link> */}
        <button className="hover:bg-red-600 mt-auto p-2 rounded text-red-300" onClick={handleLogout}>
          🚪 Logout
        </button>
      </nav>
    </div>
  );

  function handleLogout() {
    // Clear tokens, recoil state, redirect etc.
    signOut();
    console.log(`user after signout ${user}`);
    console.log("Logout user");
    navigate('/signin');
    
  }
}

