const json = require("./config");
const url = json.url;
var player = require("play-sound")((opts = {}));
const opn = require("opn");

const https = require("https");

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
          // console.log(body);
          if (statusCode === 200) {
            handleData(body);
          }
        });
    })
    .on("error", e => {
      console.error(e);
    });
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

setInterval(() => {
  fetchData();
}, 5000);
