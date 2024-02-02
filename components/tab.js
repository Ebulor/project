import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import Link from "next/link";
import FriendRequests from "./friendRequests";
export default function ColorTabs() {
  const [value, setValue] = React.useState("notifications");
  const route = useRouter();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    route.push(
      {
        pathname: route.pathname,
        query: { ...route.query, value: newValue },
      },
      { shallow: true }
    );

    // route.push(
    //   {
    //     pathname: `/allnotifications`,
    //     query: {
    //       value,
    //     },
    //   },
    //   newValue === "notifications"
    //     ? `/allnotifications`
    //     : `/allnotifications/?value=${newValue}`,
    //   { shallow: true }
    // );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value="notifications" label="Activity" />
        <Tab
          value="friendRequests"
          label="Friend requests"
          style={{ marginLeft: "auto" }}
        />
      </Tabs>
    </Box>
  );
}
