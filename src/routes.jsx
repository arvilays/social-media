import App from "./App";
import Welcome from "./views/Welcome";
import Home from "./views/Home";
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
        element: <Home />,
      }
      // {
      //   path: "leaderboard/:slug?",
      //   element: <Leaderboard />,
      // },
    ],
  },
];

export default routes;