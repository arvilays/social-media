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
      {
        path: "post/:postId",
        element: <Dashboard currentView="post" />
      },
      {
        path: "explore",
        element: <Dashboard currentView="explore" />
      },
      {
        path: "bookmarks",
        element: <Dashboard currentView="bookmarks" />
      },
      {
        path: "settings",
        element: <Dashboard currentView="settings" />
      },
    ],
  },
];

export default routes;