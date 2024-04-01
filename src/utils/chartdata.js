import data from "layouts/tables/data/authorsTableData";
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
  if (type == "day") {
    let data = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Teams", data: [50, 20, 10, 22, 50, 10, 40] },
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
    data.datasets.label = "teams";
    data.datasets.data = hourlydata;
    return data;
  } else if (type == "week") {
    let weeks = [0, 1, 2, 3, 4, 5, 6];
    let data = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Teams", data: [50, 20, 10, 22, 50, 10, 40] },
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
  if (z > 0) {
    return Math.floor(z);
  }
  else {
    return Math.floor(z);
  }
}