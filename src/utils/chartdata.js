import data from "layouts/tables/data/authorsTableData";

const slots = [
  "13:00", "13:15", "13:30", "13:45",
  "14:00", "14:15", "14:30", "14:45",
  "15:00", "15:15", "15:30", "15:45"
]

const formattedslots = [
  "13:00", "13:15", "13:30", "13:45",
  "14:00", "14:15", "14:30", "16:45",
  "17:00", "17:15", "17:30", "17:45"
]

const hours = [
  "1am",
  "2am",
  "3am",
  "4am",
  "5am",
  "6am",
  "7am",
  "8am",
  "9am",
  "10am",
  "11am",
  "12am",
  "13am",
  "14am",
  "15am",
  "16am",
  "17am",
  "18am",
  "19am",
  "20am",
  "21am",
  "22am",
  "23am",
  "24am",
];
const formattedhours = [
  "1AM",
  "2am",
  "3am",
  "4am",
  "5AM",
  "6am",
  "7am",
  "8am",
  "9AM",
  "10am",
  "11am",
  "12am",
  "1PM",
  "2pm",
  "3pm",
  "4pm",
  "5PM",
  "6pm",
  "7pm",
  "8pm",
  "9PM",
  "10pm",
  "11pm",
  "0am",
];
const formattedweeks = ["S", "M", "T", "W", "T", "F", "S"];
const formattedmonths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function setchartdata(teams, type, l) {
  if (type == "1min") {
    let data = {
      labels: [],
      datasets: { label: "Requests", data: [] },
    };

    // Generate slots dynamically
    function generateSlots(hoursBack = 1, slotSize = 1) {
      let now = new Date();
      let cutoff = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
      let slots = [];

      for (let t = new Date(cutoff); t <= now; t = new Date(t.getTime() + slotSize * 60 * 1000)) {
        slots.push({
          label: `${String(t.getHours()).padStart(2, "0")}:${String(
            Math.floor(t.getMinutes() / slotSize) * slotSize
          ).padStart(2, "0")}`,
          start: t,
          end: new Date(t.getTime() + slotSize * 60 * 1000),
        });
      }
      return slots;
    }

    // Create slots for last 3 hours in 15min intervals
    let slots = generateSlots(1, 1);

    // Count how many teams fall into each slot
    let slotsdata = slots.map((slot) =>
      teams.filter((team) => {
        let created = new Date(team.createdAt);
        return created >= slot.start && created < slot.end;
      }).length
    );

    data.labels = slots.map((s) => s.label); // use dynamic slot labels
    data.datasets.data = slotsdata;
    return data;
  }
  else if (type == "5min") {
    let data = {
      labels: [],
      datasets: { label: "Requests", data: [] },
    };

    // Generate slots dynamically
    function generateSlots(hoursBack = 2, slotSize = 5) {
      let now = new Date();
      let cutoff = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
      let slots = [];

      for (let t = new Date(cutoff); t <= now; t = new Date(t.getTime() + slotSize * 60 * 1000)) {
        slots.push({
          label: `${String(t.getHours()).padStart(2, "0")}:${String(
            Math.floor(t.getMinutes() / slotSize) * slotSize
          ).padStart(2, "0")}`,
          start: t,
          end: new Date(t.getTime() + slotSize * 60 * 1000),
        });
      }
      return slots;
    }

    // Create slots for last 3 hours in 15min intervals
    let slots = generateSlots(2, 5);

    // Count how many teams fall into each slot
    let slotsdata = slots.map((slot) =>
      teams.filter((team) => {
        let created = new Date(team.createdAt);
        return created >= slot.start && created < slot.end;
      }).length
    );

    data.labels = slots.map((s) => s.label); // use dynamic slot labels
    data.datasets.data = slotsdata;
    return data;
  }
  else if (type == "hour") {
    let data = {
      labels: [],
      datasets: { label: "Requests", data: [] },
    };

    // Generate slots dynamically
    function generateSlots(hoursBack = 3, slotSize = 15) {
      let now = new Date();
      let cutoff = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
      let slots = [];

      for (let t = new Date(cutoff); t <= now; t = new Date(t.getTime() + slotSize * 60 * 1000)) {
        slots.push({
          label: `${String(t.getHours()).padStart(2, "0")}:${String(
            Math.floor(t.getMinutes() / slotSize) * slotSize
          ).padStart(2, "0")}`,
          start: t,
          end: new Date(t.getTime() + slotSize * 60 * 1000),
        });
      }
      return slots;
    }

    // Create slots for last 3 hours in 15min intervals
    let slots = generateSlots(3, 15);

    // Count how many teams fall into each slot
    let slotsdata = slots.map((slot) =>
      teams.filter((team) => {
        let created = new Date(team.createdAt);
        return created >= slot.start && created < slot.end;
      }).length
    );

    data.labels = slots.map((s) => s.label); // use dynamic slot labels
    data.datasets.data = slotsdata;
    return data;
  }
  else if (type == "day") {
    let data = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Requests", data: [50, 20, 10, 22, 50, 10, 40] },
    };
    let allhours = [];
    for (let i = 0; i < teams.length; i++) {
      let x = new Date(teams[i].createdAt);
      let y = new Date();
      let z = x.getDate() == y.getDate() && x.getMonth() == y.getMonth();
      if (z) {
        allhours.push(new Date(teams[i].createdAt).getHours());
      }
    }
    let hourlydata = [];
    for (let i = 0; i < hours.length; i++) {
      let a = allhours.filter((s) => s + "am" == hours[i]);
      hourlydata.push(a.length);
    }
    data.labels = formattedhours;
    data.datasets.label = "requests";
    data.datasets.data = hourlydata;
    return data;
  } else if (type == "week") {
    let weeks = [0, 1, 2, 3, 4, 5, 6];
    let data = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Requests", data: [50, 20, 10, 22, 50, 10, 40] },
    };
    let alldays = [];
    for (let i = 0; i < teams.length; i++) {
      let a = new Date(teams[i].createdAt).getDate();
      let b = new Date().getDate();
      let d = b - a;
      let x = new Date().getMonth();
      let y = new Date(teams[i].createdAt).getMonth();
      if (d < 7 && x == y) {
        alldays.push(new Date(teams[i].createdAt).getDay());
      }
    }
    let weeklydata = [];
    for (let i = 0; i < weeks.length; i++) {
      let a = alldays.filter((s) => s == weeks[i]);
      weeklydata.push(a.length);
    }
    data.labels = formattedweeks;
    data.datasets.label = l;
    data.datasets.data = weeklydata;
    return data;
  }
  else if (type == "month") {
    let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    let data = {
      labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"],
      datasets: { label: "Teams", data: [50, 20, 10, 22, 50, 10, 40] },
    };
    let alldays = [];
    for (let i = 0; i < teams.length; i++) {
      let a = new Date(teams[i].createdAt).getDate();
      let b = new Date().getDate();
      let d = b - a;
      let x = new Date().getYear();
      let y = new Date(teams[i].createdAt).getYear();
      if (d < 30 && x == y) {
        alldays.push(new Date(teams[i].createdAt).getMonth());
      }
    }
    let monthlydata = [];
    for (let i = 0; i < months.length; i++) {
      let a = alldays.filter((s) => s == months[i]);
      monthlydata.push(a.length);
    }
    data.labels = formattedmonths;
    data.datasets.label = l;
    data.datasets.data = monthlydata;
    return data;
  }
}

export function setmatcheschartdata(matches, type) {
  if (type == "day") {
    console.log(matches, "matches");
    let data = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40] },
    };
    let allhours = [];
    for (let i = 0; i < matches.length; i++) {
      let x = new Date(matches[i].date);
      let y = new Date();
      let z = x.getDate() == y.getDate() && x.getMonth() == y.getMonth();
      if (z) {
        allhours.push(new Date(matches[i].date).getHours());
      }
    }
    let hourlydata = [];
    for (let i = 0; i < hours.length; i++) {
      let a = allhours.filter((s) => s + "am" == hours[i]);
      hourlydata.push(a.length);
    }
    data.labels = formattedhours;
    data.datasets.label = "matches";
    data.datasets.data = hourlydata;
    console.log(hourlydata, "hourly");
    return data;
  } else if (type == "week") {
    let weeks = [0, 1, 2, 3, 4, 5, 6];
    let data = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40] },
    };
    let alldays = [];
    for (let i = 0; i < matches.length; i++) {
      let a = new Date(matches[i].date).getDate();
      let b = new Date().getDate();
      let d = b - a;
      let x = new Date().getMonth();
      let y = new Date(matches[i].date).getMonth();
      if (d < 7 && x == y) {
        alldays.push(new Date(matches[i].date).getDay());
      }
    }
    let weeklydata = [];
    for (let i = 0; i < weeks.length; i++) {
      let a = alldays.filter((s) => s == weeks[i]);
      weeklydata.push(a.length);
    }
    console.log(weeklydata, alldays, "special");
    data.labels = formattedweeks;
    data.datasets.label = "matches";
    data.datasets.data = weeklydata;
    return data;
  }
  else if (type == "month") {
    let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    let data = {
      labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"],
      datasets: { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40] },
    };
    let allmonths = [];
    for (let i = 0; i < matches.length; i++) {
      let a = new Date(matches[i].date).getDate();
      let b = new Date().getDate();
      let d = b - a;
      let x = new Date().getYear();
      let y = new Date(matches[i].date).getYear();
      if (d < 30 && x == y) {
        allmonths.push(new Date(matches[i].date).getMonth());
      }
    }
    let monthlydata = [];
    for (let i = 0; i < months.length; i++) {
      let a = allmonths.filter((s) => s == months[i]);
      monthlydata.push(a.length);
    }
    console.log(monthlydata, allmonths, "special");
    data.labels = formattedmonths;
    data.datasets.label = "matches";
    data.datasets.data = monthlydata;
    return data;
  }
}

export function setdoughchartdata(arr, type) {
  let data = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40] },
  };
  let users = [];
  let matchids = [];
  for (let i = 0; i < arr.length; i++) {
    users.push(arr[i].username);
    matchids.push(arr[i].matchIds.length)
  }
  data.labels = users;
  data.datasets.label = "matches";
  data.datasets.data = matchids;
  data.datasets.backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
  ];
  data.datasets.borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'];
  return data;
}

export function todaysdata(arr) {
  let today = [];
  for (let i = 0; i < arr.length; i++) {
    let x = new Date(arr[i].createdAt);
    let y = new Date();
    let z = x.getDate() == y.getDate() && x.getMonth() == y.getMonth();
    if (z) {
      today.push(new Date(arr[i].createdAt).getHours());
    }
  }
  return today;
}

export function thisweekdata(arr) {
  let thisweekdata = [];
  for (let i = 0; i < arr.length; i++) {
    let a = new Date(arr[i].createdAt).getDate();
    let b = new Date().getDate();
    let d = b - a;
    let x = new Date().getMonth();
    let y = new Date(arr[i].createdAt).getMonth();
    if (d < 7 && x == y) {
      thisweekdata.push(new Date(arr[i].createdAt).getDay());
    }
  }
  return thisweekdata;
}

export function lastweekdata(arr) {
  let lastweekdata = [];
  for (let i = 0; i < arr.length; i++) {
    let a = new Date(arr[i].createdAt).getDate();
    let b = new Date().getDate();
    let d = b - a;
    let x = new Date().getMonth();
    let y = new Date(arr[i].createdAt).getMonth();
    if (d > 7 && (d < 14) && x == y) {
      lastweekdata.push(new Date(arr[i].createdAt).getDay());
    }
  }
  return lastweekdata;
}

export function getpercentage(arr) {
  let a = thisweekdata(arr).length;
  let b = lastweekdata(arr).length;
  let z = ((a / b) * 100) - 100;
  if (b == 0) {
    return 0;
  }
  if (z > 0) {
    return Math.floor(z);
  }
  else {
    return Math.floor(z);
  }
}

export function setbarchartdata(teams, type, l) {
  let groups = {}
  for (let i = 0; i < teams?.length; i++) {
    groups[teams[i]?.matchdetails?.matchTitle] = teams[i]?.matchdetails?.matchTitle
  }
  let labels = Object.keys(groups);
  if (type == "1min") {
    teams = teams.filter((t) => (new Date() - new Date(t.createdAt)) < 60 * 60 * 1000)
    let data = {
      labels: [],
      datasets: { label: "Requests", data: [] },
    };

    let groups = {}
    for (let i = 0; i < teams?.length; i++) {
      groups[teams[i].matchdetails?.matchTitle] = teams[i]?.matchdetails?.matchTitle
    }

    // Generate slots dynamically
    function generateSlots(hoursBack = 1, slotSize = 1) {
      let now = new Date();
      let cutoff = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
      let slots = [];

      for (let t = new Date(cutoff); t <= now; t = new Date(t.getTime() + slotSize * 60 * 1000)) {
        slots.push({
          label: `${String(t.getHours()).padStart(2, "0")}:${String(
            Math.floor(t.getMinutes() / slotSize) * slotSize
          ).padStart(2, "0")}`,
          start: t,
          end: new Date(t.getTime() + slotSize * 60 * 1000),
        });
      }
      return slots;
    }

    // Create slots for last 3 hours in 15min intervals
    let slots = generateSlots(1, 1);

    let slotsdata = [];
    for (let i = 0; i < labels.length; i++) {
      let a = teams.filter((s) => s.matchdetails?.matchTitle == labels[i]);
      slotsdata.push(a.length);
    }

    data.labels = Object.keys(groups)
    data.datasets.data = slotsdata;
    return data;
  }
  else if (type == "5min") {
    teams = teams.filter((t) => new Date() - new Date(t.createdAt) < 60 * 60 * 4 * 1000)
    let data = {
      labels: [],
      datasets: { label: "Requests", data: [] },
    };

    // Generate slots dynamically
    function generateSlots(hoursBack = 2, slotSize = 5) {
      let now = new Date();
      let cutoff = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
      let slots = [];

      for (let t = new Date(cutoff); t <= now; t = new Date(t.getTime() + slotSize * 60 * 1000)) {
        slots.push({
          label: `${String(t.getHours()).padStart(2, "0")}:${String(
            Math.floor(t.getMinutes() / slotSize) * slotSize
          ).padStart(2, "0")}`,
          start: t,
          end: new Date(t.getTime() + slotSize * 60 * 1000),
        });
      }
      return slots;
    }

    // Create slots for last 3 hours in 15min intervals
    let slots = generateSlots(2, 5);

    // Count how many teams fall into each slot
    let slotsdata = [];
    for (let i = 0; i < labels.length; i++) {
      let a = teams.filter((s) => s.matchdetails.matchTitle == labels[i]);
      slotsdata.push(a.length);
    }

    data.labels = labels; // use dynamic slot labels
    data.datasets.data = slotsdata;
    return data;
  }
  else if (type == "hour") {
    teams = teams.filter((t) => new Date() - new Date(t.createdAt) < 60 * 60 * 24 * 1000)
    let data = {
      labels: labels,
      datasets: { label: "Requests", data: [] },
    };

    // Generate slots dynamically
    function generateSlots(hoursBack = 3, slotSize = 15) {
      let now = new Date();
      let cutoff = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
      let slots = [];

      for (let t = new Date(cutoff); t <= now; t = new Date(t.getTime() + slotSize * 60 * 1000)) {
        slots.push({
          label: `${String(t.getHours()).padStart(2, "0")}:${String(
            Math.floor(t.getMinutes() / slotSize) * slotSize
          ).padStart(2, "0")}`,
          start: t,
          end: new Date(t.getTime() + slotSize * 60 * 1000),
        });
      }
      return slots;
    }

    // Create slots for last 3 hours in 15min intervals
    let slots = generateSlots(3, 15);

    // Count how many teams fall into each slot
    let slotsdata = [];
    for (let i = 0; i < labels.length; i++) {
      let a = teams.filter((s) => s.matchdetails?.matchTitle == labels[i]);
      slotsdata.push(a.length);
    }
    data.labels = Object.keys(groups); // use dynamic slot labels
    data.datasets.data = slotsdata;
    return data;
  }
  else if (type == "day") {
    teams = teams.filter((t) => new Date() - new Date(t.createdAt) < 60 * 60 * 24 * 1000)
    let data = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Requests", data: [50, 20, 10, 22, 50, 10, 40] },
    };
    let allhours = [];
    for (let i = 0; i < teams.length; i++) {
      let x = new Date(teams[i].createdAt);
      let y = new Date();
      let z = x.getDate() == y.getDate() && x.getMonth() == y.getMonth();
      if (z) {
        allhours.push(new Date(teams[i].createdAt).getHours());
      }
    }
    let slotsdata = [];
    for (let i = 0; i < labels.length; i++) {
      let a = teams.filter((s) => s.matchdetails?.matchTitle == labels[i]);
      slotsdata.push(a.length);
    }
    data.labels = Object.keys(groups);
    data.datasets.label = "requests";
    data.datasets.data = slotsdata;
    return data;
  } else if (type == "week") {
    teams = teams.filter((t) => new Date() - new Date(t.createdAt) < 60 * 60 * 24 * 30 * 1000)
    let weeks = [0, 1, 2, 3, 4, 5, 6];
    let data = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Requests", data: [50, 20, 10, 22, 50, 10, 40] },
    };
    let alldays = [];
    for (let i = 0; i < teams.length; i++) {
      let a = new Date(teams[i].createdAt).getDate();
      let b = new Date().getDate();
      let d = b - a;
      let x = new Date().getMonth();
      let y = new Date(teams[i].createdAt).getMonth();
      if (d < 7 && x == y) {
        alldays.push(new Date(teams[i].createdAt).getDay());
      }
    }
    let weeklydata = [];
    for (let i = 0; i < labels.length; i++) {
      let a = teams.filter((s) => s.matchdetails?.matchTitle == labels[i]);
      weeklydata.push(a.length);
    }
    data.labels = labels
    data.datasets.label = l;
    data.datasets.data = weeklydata;
    return data;
  }
  else if (type == "month") {
    let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    let data = {
      labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"],
      datasets: { label: "Teams", data: [50, 20, 10, 22, 50, 10, 40] },
    };
    let alldays = [];
    for (let i = 0; i < teams.length; i++) {
      let a = new Date(teams[i].createdAt).getDate();
      let b = new Date().getDate();
      let d = b - a;
      let x = new Date().getYear();
      let y = new Date(teams[i].createdAt).getYear();
      if (d < 30 && x == y) {
        alldays.push(new Date(teams[i].createdAt).getMonth());
      }
    }
    let monthlydata = [];
    for (let i = 0; i < labels.length; i++) {
      let a = teams.filter((s) => s.matchdetails?.matchTitle == labels[i]);
      monthlydata.push(a.length);
    }
    data.labels = labels
    data.datasets.label = l;
    data.datasets.data = monthlydata;
    return data;
  }
}