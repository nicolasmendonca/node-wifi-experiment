const wifi = require("node-wifi");
const fs = require("fs");
const chalk = require("chalk");
const shell = require("shelljs");
require("dotenv").config();

const { SSID: ssid, PASSWORD: password } = process.env;

console.log(chalk.blue("Starting WIFI interface"));
wifi.init({
  iface: null
});

console.log(chalk.blue("Scanning for networks..."));
wifi.scan((err, networks) => {
  if (err) {
    return console.error(err);
  }
  console.log("networks", networks);
  console.log(chalk.blue("Saving networks to file..."));
  fs.writeFile("networks.json", JSON.stringify(networks), "utf8", () => {
    if (err) {
      return console.error("error writing JSON file", err);
    }
    console.log(chalk.green("Networks saved!"));
  });

  console.log(chalk.cyan(`Looking for ${ssid}`));
  const network = networks.find(network => network.ssid === ssid);
  if (!network) {
    console.error(
      chalk.bgRed.black("Network not found, starting over in 10 seconds...")
    );
    setTimeout(() => {
      return shell.exec("node ./index.js");
    }, 10 * 1000);
  }
});
