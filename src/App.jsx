import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import Login from './AuthModule/Components/Login/Login';
import RequestPassReset from './AuthModule/Components/RequestPassReset/RequestPassReset';
import ResetPass from './AuthModule/Components/ResetPass/ResetPass';
import CategoriesList from './CategoriesModule/Components/CategoriesList/CategoriesList';
import Home from './HomeModule/Components/Home/Home';
import RecipesList from './RecipesModule/Components/RecipesList/RecipesList';
import AuthLayout from './SharedModule/Components/AuthLayout/AuthLayout';
import MasterLayout from './SharedModule/Components/MasterLayout/MasterLayout';
import NotFound from './SharedModule/Components/NotFound/NotFound';
import ProtectedRoute from './SharedModule/Components/ProtectedRoute/ProtectedRoute';
import UsersList from './UsersModule/Components/UsersList/UsersList';
import { useContext } from 'react';
import { AuthContext } from './Context/AuthContext';
import { Offline } from 'react-detect-offline';
import Disconnected from './SharedModule/Components/Disconnected/Disconnected';


function App() {

let{adminData,saveAdminData}=useContext(AuthContext);

  const routes=createHashRouter([
    {
      path:"/dashboard",
      element:<ProtectedRoute adminData={adminData}><MasterLayout adminData={adminData}/></ProtectedRoute>,
      errorElement:<NotFound/>,
      children:[
        {index:true,element:<Home  adminData={adminData} />},
        {path:'users',element:<UsersList/>},
        {path:'recipes',element:<RecipesList/>},
        {path:'categories',element:<CategoriesList/>},
      ]
    },
    {
      path:"/",
      element:<AuthLayout/>,
      errorElement:<NotFound/>,
      children:[
        {index:true,element: <Login saveAdminData={saveAdminData}/>},
        {path:'login',element:<Login saveAdminData={saveAdminData}/>},
        {path:'request-pass-reset',element:<RequestPassReset/>},
        {path:'reset-pass',element:<ResetPass/>},
      ]

    }
  ])

  return (
    <>
    <Toaster/>
    <ToastContainer theme='dark'
    autoClose={2000}/>

    <RouterProvider router={routes} />
    {/* <Offline><Disconnected/></Offline> */}
    </>
  )
}

export default App
