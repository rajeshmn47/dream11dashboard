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
export function setchartdata(teams, type,l) {
  if (type == "day") {
    let data = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40] },
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
      datasets: { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40] },
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
}

export function todaysdata(arr){
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