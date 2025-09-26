import App from "./App";
import Welcome from "./views/Welcome";
import Dashboard from "./views/Dashboard";
import ErrorPage from "./views/ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: "home",
        element: <Dashboard />,
      },
      {
        path: "user/:username",
        element: <Dashboard currentView="profile" />
      },
    ],
  },
];

export default routes;