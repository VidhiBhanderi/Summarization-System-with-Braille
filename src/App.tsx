// import { Navigate, Route, Routes } from 'react-router-dom';
// import Translator from './Components/translater';
// import Login from './Components/login';
// import Register from './Components/register';
// import { useState } from 'react';
// import ConfirmationModal from './Components/PopupModel';

// function App() {

//   const [loading, setLoading] = useState(false);
//   const [logoutModalOpen, setLogoutModalOpen] = useState(false);

//   const handleLogout = () => {
//     // Open the logout confirmation modal
//     setLogoutModalOpen(true);
//   };

//   const handleConfirmLogout = () => {
//     setLoading(true);
//     console.log("logging out");
//     sessionStorage.clear();
//     // Redirect to the login page
//     setLoading(false);
//     window.location.href = "/Login";
//   };

//   const handleCloseLogoutModal = () => {
//     // Close the logout confirmation modal
//     setLogoutModalOpen(false);
//   };

//   const Logout = () => {
//     return null; // Since Logout is not a component, it doesn't return JSX
//   };

//   return (
//     <div className="App">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//       <ConfirmationModal
//         open={logoutModalOpen}
//         onClose={handleCloseLogoutModal}
//         title="Logout Confirmation"
//         content="Are you sure you want to logout?"
//         onConfirm={handleConfirmLogout}
//       />
//       <Routes>
//         <Route path='/' element={<Navigate to="/Login" replace />} />
//         <Route path='/Login' element={<Login/>} />
//         <Route path='/Translator' element={<Translator handleLogout={handleLogout} />} />
//         <Route path='/Register' element={<Register/>} />
//         <Route path='/Logout' element={<Logout/>} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

import { Navigate, Route, Routes } from 'react-router-dom';
import Translator from './Components/translater';
import Login from './Components/login';
import Register from './Components/register';
import { useState } from 'react';
import ConfirmationModal from './Components/PopupModel';

function App() {
  const [loading, setLoading] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(true);

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setLoading(true);
    console.log("logging out");
    sessionStorage.clear();
    setLoading(false);
    window.location.href = "/Login";
  };

  const handleCloseLogoutModal = () => {
    setLogoutModalOpen(false);
    window.location.href = "/Translator"
  };

  const Logout = () => {
    return (
      <ConfirmationModal
        open={logoutModalOpen}
        onClose={handleCloseLogoutModal}
        title="Logout Confirmation"
        content="Are you sure you want to logout?"
        onConfirm={handleConfirmLogout}
      />
    ); // Since Logout is not a component, it doesn't return JSX
  };

  return (
    <div className="App">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      
      <Routes>
        <Route path='/' element={<Navigate to="/Login" replace />} />
        <Route path='/Login' element={<Login/>} />
        <Route path='/Translator' element={<Translator />} />
        <Route path='/Register' element={<Register/>} />
        <Route path='/Logout' element={<Logout/>} />
      </Routes>
    </div>
  );
}

export default App;
