import React from "react";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import Join from "./components/Join/Join";
import Chat from "./components/Chat/Chat";
import Error from "./components/Error";

const router = createBrowserRouter([
  {
    path:'/',
    element:<Join />,
    errorElement: <Error />
  },
  {
    path:'/chat',
    element:<Chat />
  }
])

const App = () =>{
  return (
    <RouterProvider router={router} />
  )
}

export default App;