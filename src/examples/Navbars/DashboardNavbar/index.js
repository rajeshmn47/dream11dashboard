import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { setLoggedIn } from "context";
import { URL } from "constants/userconstants";
import { API } from "api";
import { getDisplayDate } from "utils/dateformat";
import { Badge } from "@mui/material";

function DashboardNavbar({ absolute, light, isMini }) {
  const navigate = useNavigate();
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode, loggedIn } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [openAccountMenu, setOpenAccountMenu] = useState(false);
  const [notifications, setNotifications] = useState();
  const [unreadCount, setUnreadCount] = useState(0);
  const route = useLocation().pathname.split("/").slice(1);

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const { data } = await API.get(`${URL}/notifications/all?unreadOnly=true`);
        setNotifications(data.notifications.slice(0, 10));   // save notifications to state
        setUnreadCount(data.unread)
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    getNotifications();
  }, []);

  const notificationIcons = {
    kyc: "verified_user",
    deposit: "arrow_downward",      // money added
    withdraw: "arrow_upward",       // money removed
    general: "notifications",       // default
  };

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = async (event) => {
    setOpenMenu(event.currentTarget);
    await API.put(`${URL}/notifications/admin-mark-read`);
    setUnreadCount(0);
  }
  const handleOpenAccountMenu = (event) => setOpenAccountMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);
  const handleCloseAccountMenu = () => setOpenAccountMenu(false);
  const handleProfileClick = () => {
    navigate('/profile')
  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(dispatch, false);
  }

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      {(!notifications?.length > 0) ? (
        <NotificationItem
          icon={<Icon>notifications_off</Icon>}
          title="No notifications"
        />
      ) : (
        <>
          {notifications.map((n) => (
            <div
              key={n._id}
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #eee",
                background: n.read ? "#fff" : "#eef6ff", // highlight unread
                cursor: "pointer",
                minWidth: "260px"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: n.read ? "normal" : "600" }}>
                  {n.title}
                </span>

                {n.message && (
                  <span style={{ fontSize: "0.85rem", color: "#555" }}>
                    {n.message}
                  </span>
                )}

                <span style={{ fontSize: "0.75rem", color: "gray", marginTop: "4px" }}>
                  {getDisplayDate(n.createdAt)}
                </span>
              </div>
            </div>
          ))}

        </>
      )}
    </Menu>
  );

  const renderAccountMenu = () => (
    <Menu
      anchorEl={openAccountMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openAccountMenu)}
      onClose={handleCloseAccountMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem onClick={() => handleProfileClick()} icon={<Icon>profile</Icon>} title="your profile" />
      <NotificationItem onClick={() => handleLogout()} icon={<Icon>log_out</Icon>} title="log out" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox color={light ? "white" : "inherit"}>
              {loggedIn &&
                <IconButton sx={navbarIconButton} size="small" disableRipple
                  color="inherit"
                  aria-controls="notification-menu"
                  aria-haspopup="true"
                  variant="contained"
                  onClick={handleOpenAccountMenu}>
                  <Icon sx={iconsStyle}>account_circle</Icon>
                </IconButton>
              }
              {renderAccountMenu()}
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Badge
                  badgeContent={unreadCount > 0 ? unreadCount : null}
                  color="error"
                  overlap="circular"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Icon sx={iconsStyle}>notifications</Icon>
                </Badge>
              </IconButton>
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
