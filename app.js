const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const commands = require('./commands.js');


client.on('ready', () => {
  print(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ game: { name: config.status }, status: 'online' })
    .then(print(`Presence set to: "${config.status}"`))
    .catch(console.error);
});

client.on('message', () =>{
  if (message.author == client.user || message.author.bot)
    {return;} //Ignore bot users.
  
  if (!message.content.startsWith(config.prefix))
    {return;} //Ignore messages not meant for us.
  
  let contentArray = message.content.split(" ");
  let prefix = contentArray.splice(0, 1)[0].substring(1);
  let message = contentArray.join(" ");

  /*TO DO:
    classic command checking stuff.
  */

});

print = function(message){ //for prettier printing.
  console.log(`[${new Date().toLocaleTimeString('en-GB',{hour12:false,timeZoneName:'short'})}] ${message}`);
}

client.login(config.token);