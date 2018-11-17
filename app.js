const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const commands = require('./modules/commands.js');
const FH = require('./modules/fileHandler.js')
client.config = config;

var dataHandlers = {
  channels: new FH("./data/channels.json"),
  prompts: new FH("./data/prompts.json"),
};
for (var key in dataHandlers) {
  dataHandlers[key].load();
}
function saveIntervalElapsed() {
  print(`FH: Saving data.`)
  for (var key in dataHandlers) {
    dataHandlers[key].save();
  }
}

function promptPriorityUpdateElapsed() {
  print(`Updating priority of prompts.`);
  dataHandlers[prompts].data.forEach((a)=>{a.priority = a.priority++;})
  print(`${dataHandlers[prompts].data.length} prompts updated.`);
}

client.on('ready', () => {
  print(`Logged in as ${client.user.tag}!`);
  setInterval(saveIntervalElapsed, 1000 * 60 * 5);//save data every 5 minutes to disk.
  setInterval(promptPriorityUpdateElapsed, 1000 * 60 *60 * 24);//bump prompts up every day.
  client.user.setPresence({ game: { name: config.status }, status: 'online' })
    .then(print(`Presence set to: "${config.status}"`))
    .catch(console.error);
});

client.on('message', (message) => {
  if (message.author == client.user || message.author.bot) { return; } //Ignore bot users.

  if (!message.content.startsWith(config.prefix)) { return; } //Ignore messages not meant for us.

  let contentArray = message.content.split(" ");
  let prefix = contentArray.splice(0, 1)[0].substring(1);
  let filteredMessage = contentArray.join(" ");

  if (commands.hasOwnProperty(prefix)) {
    commands[prefix].method(message, dataHandlers,filteredMessage);
  }

});

print = function (message) { //for prettier printing.
  console.log(`[${new Date().toLocaleTimeString('en-GB', { hour12: false, timeZoneName: 'short' })}] ${message}`);
}

client.login(config.token);