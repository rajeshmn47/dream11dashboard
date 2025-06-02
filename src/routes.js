/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";
import MatchDetails from "layouts/matchdetails";
import Matches from "layouts/matches";
import Contests from "layouts/contestTypes";
import ApiKeyManagement from "layouts/apikeymanagement";
import Withdrawals from "layouts/withdrawals";
import KYC from "layouts/kyc";
import SuspiciousActivities from "layouts/suspiciousActivities";
import Deposits from "layouts/deposits";
import Configuration from "layouts/config";
import SeriesList from "layouts/series";
import SquadsPage from "layouts/squads";
import PlayerTable from "layouts/playersTable";
import TeamList from "layouts/teams";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Withdrawals(24)",
    key: "withdrawals",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/withdrawals",
    component: <Withdrawals />,
  },
  {
    type: "collapse",
    name: "KYC(5)",
    key: "kyc",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/kyc",
    component: <KYC />,
  },
  {
    type: "collapse",
    name: "Contests(24)",
    key: "contests",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/contests",
    component: <Contests />,
  },
  // DO NOT import AddSeries

  // Inside the routes array
  {
    type: "collapse",
    name: "Series",
    key: "series",
    icon: <Icon fontSize="small">sports_cricket</Icon>,
    route: "/series",
    component: <SeriesList />,
  },
  {
    type: "collapse",
    name: "Squads",
    key: "squads",
    icon: <Icon fontSize="small">groups</Icon>,
    route: "/squads",
    component: <SquadsPage />,
  },
    {
    type: "collapse",
    name: "Players",
    key: "players",
    icon: <Icon fontSize="small">groups</Icon>,
    route: "/players",
    component: <PlayerTable />,
  },  {
    type: "collapse",
    name: "Teams",
    key: "teams",
    icon: <Icon fontSize="small">groups</Icon>,
    route: "/teams",
    component: <TeamList />,
  },
  {
    type: "collapse",
    name: "Matches(24)",
    key: "matches",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/matches",
    component: <Matches />,
  },
  {
    type: "collapse",
    name: "Deposits(24)",
    key: "deposits",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/deposits",
    component: <Deposits />,
  },
  {
    type: "collapsed",
    name: "MatchDetails",
    key: "matchDetails",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/matchDetails/:id",
    component: <MatchDetails />,
  },
  {
    type: "collapse",
    name: "Suspicious Activities(4)",
    key: "suspicious",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/suspicious",
    component: <SuspiciousActivities />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Configuration(24)",
    key: "configuration",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/configuration",
    component: <Configuration />,
  },
  {
    type: "collapse",
    name: "ApiKey Management",
    key: "apikey",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/apikey",
    component: <ApiKeyManagement />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;
