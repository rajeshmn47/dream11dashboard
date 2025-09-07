import { useState } from "react";
import MDSnackbar from "components/MDSnackbar";

export default function useNotification() {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState({
    color: "info",
    icon: "notifications",
    title: "Notification",
    content: "",
    autoHideDuration: 4000,
  });

  const showNotification = ({ color, icon, title, content, autoHideDuration = 4000 }) => {
    setConfig({ color, icon, title, content, autoHideDuration });
    setOpen(true);

    if (autoHideDuration) {
      setTimeout(() => setOpen(false), autoHideDuration);
    }
  };

  const closeNotification = () => setOpen(false);

  const NotificationComponent = () => (
    <MDSnackbar
      color={config.color}
      icon={config.icon}
      title={config.title}
      content={config.content}
      dateTime="just now"
      open={open}
      onClose={closeNotification}
      close={closeNotification}
      bgWhite
    />
  );

  return { showNotification, NotificationComponent };
}
