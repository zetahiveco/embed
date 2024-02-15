import { RouterProvider, createBrowserRouter, useNavigate } from "react-router-dom"
import Login from "./pages/admin/auth/login"
import Signup from "./pages/admin/auth/signup";
import { useAccounts } from "./data/accounts";
import Visualization from "./pages/admin/visualization";
import axios from "axios";
import { getToken } from "./utils/auth";
import Cookies from "js-cookie";
import { useEffect } from "react";
import Sources from "./pages/admin/sources";
import Settings from "./pages/admin/settings";

axios.interceptors.request.use(async (request) => {
  request.baseURL = import.meta.env["REACT_APP_API"];
  let token = await getToken();
  if (token && request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
    if (Cookies.get("organization-id")) {
      request.headers["organization-id"] = `${Cookies.get("organization-id")}`;
    }
  }
  return request;
})

function App() {
  const userId = useAccounts(s => s.userId);
  const currentOrganization = useAccounts(s => s.currentOrganization);

  const Root = () => {

    const navigate = useNavigate();

    useEffect(() => {
      if (!userId || !currentOrganization) {
        navigate("/admin/auth/login");
      } else {
        navigate("/admin/visualizations");
      }
    }, [])

    return <></>
  }

  const publicRoutes = createBrowserRouter([
    {
      path: "/",
      element: <Root />
    },
    {
      path: "/admin/auth/login",
      element: <Login />
    },
    {
      path: "/admin/auth/signup",
      element: <Signup />
    }
  ])

  const adminProtectedRoutes = createBrowserRouter([
    {
      path: "/",
      element: <Root />
    },
    {
      path: "/admin/visualizations",
      element: <Visualization />
    },
    {
      path: "/admin/sources",
      element: <Sources />
    },
    {
      path: "/admin/settings",
      element: <Settings />
    }
  ])

  if (!userId && !currentOrganization) {
    return <RouterProvider router={publicRoutes} />
  }

  if (userId && currentOrganization) {
    return <RouterProvider router={adminProtectedRoutes} />
  }

}

export default App;
