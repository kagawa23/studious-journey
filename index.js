const json = require("./config");
const url = json.url;
var player = require("play-sound")((opts = {}));
const opn = require("opn");

const https = require("https");

let timeoutHandler = null;

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * Math.floor(max - min));
}

function fetchData() {
  console.log(
    "----------------------",
    new Date().getTime(),
    "---------------------------"
  );
  https
    .get(url, res => {
      const statusCode = res.statusCode;
      console.log("statusCode:", res.statusCode);
      // console.log("headers:", res.headers);
      let body = [];
      res
        .on("data", d => {
          body.push(d);
        })
        .on("end", () => {
          body = body.toString();
          if (statusCode === 200) {
            handleData(body);
          }
        });
    })
    .on("error", e => {
      console.error(e);
    });
  const timeout = getRandomInt(5000, 10000);
  // console.log("timeout:" + timeoutHandler);
  if (!!timeoutHandler) {
    console.log("clear timeout");
    clearTimeout(timeoutHandler);
  }
  console.log("timeout:", timeout / 1000, "s");
  timeoutHandler = setTimeout(() => {
    fetchData();
  }, timeout);
}

function handleData(data) {
  const regex = json.regex;
  const isNeedMeetRegex = json.isNeedMeetRegex;
  const result = !!data.match(new RegExp(regex, "g"));
  if (result === isNeedMeetRegex) {
    reminder();
  }
}

function reminder() {
  //1. open browser
  // Opens the image in the default image viewer
  opn(url);
  //2. play music
  player.play("./alarm.m4a", function(err) {
    if (err) throw err;
  });
}

fetchData();
