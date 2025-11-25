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
import UsersList from "layouts/users";

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
    name: "Withdrawals",
    key: "withdrawals",
    icon: <Icon fontSize="small">account_balance_wallet</Icon>,
    route: "/withdrawals",
    component: <Withdrawals />,
    badge: "pendingWithdrawals",
  },
  {
    type: "collapse",
    name: "Deposits",
    key: "deposits",
    icon: <Icon fontSize="small">arrow_circle_down_icon</Icon>,
    route: "/deposits",
    component: <Deposits />,
    badge: "pendingDeposits",
  },
  {
    type: "collapse",
    name: "Matches",
    key: "matches",
    icon: <Icon fontSize="small">sports_score</Icon>,
    route: "/matches",
    component: <Matches />,
    badge: "pendingMatches",
  },
  {
    type: "collapse",
    name: "KYC",
    key: "kyc",
    icon: <Icon fontSize="small">badge</Icon>,
    route: "/kyc",
    component: <KYC />,
  },
  {
    type: "collapse",
    name: "Contests",
    key: "contests",
    icon: <Icon fontSize="small">emoji_events</Icon>,
    route: "/contests",
    component: <Contests />,
    badge: "contests",
  },
  // DO NOT import AddSeries

  // Inside the routes array
  {
    type: "collapse",
    name: "Series",
    key: "series",
    icon: <Icon fontSize="small">collections_bookmark</Icon>,
    route: "/series",
    component: <SeriesList />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/users",
    component: <UsersList />,
    badge: "pendingUsers",
  },
  {
    type: "collapse",
    name: "Squads",
    key: "squads",
    icon: <Icon fontSize="small">groups_2</Icon>,
    route: "/squads",
    component: <SquadsPage />,
  },
  {
    type: "collapse",
    name: "Players",
    key: "players",
    icon: <Icon fontSize="small">sports_soccer</Icon>,
    route: "/players",
    component: <PlayerTable />,
  }, {
    type: "collapse",
    name: "Teams",
    key: "teams",
    icon: <Icon fontSize="small">groups_3</Icon>,
    route: "/teams",
    component: <TeamList />,
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
    name: "Suspicious Activities",
    key: "suspicious",
    icon: <Icon fontSize="small">report_problem</Icon>,
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
    name: "Configuration",
    key: "configuration",
    icon: <Icon fontSize="small">settings</Icon>,
    route: "/configuration",
    component: <Configuration />,
  },
  {
    type: "collapse",
    name: "ApiKey Management",
    key: "apikey",
    icon: <Icon fontSize="small">key</Icon>,
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
