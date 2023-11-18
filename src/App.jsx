import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './AuthModule/Components/Login/Login';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MasterLayout from './SharedModule/Components/MasterLayout/MasterLayout';
import NotFound from './SharedModule/Components/NotFound/NotFound';
import RecipesList from './RecipesModule/Components/RecipesList/RecipesList';
import UsersList from './UsersModule/Components/UsersList/UsersList';
import Home from './HomeModule/Components/Home/Home';
import CategoriesList from './CategoriesModule/Components/CategoriesList/CategoriesList';
import AuthLayout from './SharedModule/Components/AuthLayout/AuthLayout';
import { ToastContainer } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import ProtectedRoute from './SharedModule/Components/ProtectedRoute/ProtectedRoute';
import RequestPassReset from './AuthModule/Components/RequestPassReset/RequestPassReset';
import ResetPass from './AuthModule/Components/ResetPass/ResetPass';
import ChangePass from './AuthModule/Components/ChangePass/ChangePass';


function App() {
const[adminData,setAdminData]=useState(null)
let saveAdminData=()=>{
  let encodedToken=localStorage.getItem('adminToken');
  let decodedToken=jwtDecode(encodedToken);
  setAdminData(decodedToken)
}

useEffect(() => {
 if(localStorage.getItem('adminToken')){
  saveAdminData();
 }
}, []);


  const routes=createBrowserRouter([
    {
      path:"/dashboard",
      element:<ProtectedRoute adminData={adminData}><MasterLayout adminData={adminData}/></ProtectedRoute>,
      errorElement:<NotFound/>,
      children:[
        {index:true,element:<Home/>},
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
    <ToastContainer theme='dark'
    autoClose={2000}/>
    <RouterProvider router={routes} />
    </>
  )
}

export default App
