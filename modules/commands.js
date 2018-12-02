module.exports = {
    "prompt": {
        description: "Gives out a user submitted prompt.",
        parameters: [],
        method: function (message, data) {
            let response = "";
            if (isPromptChannel(message, data) == false) {
                return; // If this channel is not set up for prompts, do not respond.
            } else {
                if (message.guild) {
                    if(canPrompt(message,)){
                        message.reply("Please wait atleast 1 hour until asking for a new prompt.");
                        return;
                    }
                }
                if(data['prompts'].data.length <= 0)
                {
                    message.reply("I do not have any prompts.");
                    return;
                }
            }
            let candidates = data['prompts'].data;
            candidates.sort((a,b) => {return b.priority-a.priority});
            let x = candidates[0].priority;
            candidates = candidates.filter((a)=>{return a.priority==x});
            let prompt = candidates[Math.floor(Math.random()*candidates.length)];

            message.channel.send(`${message.guild?"<@&277083656269594624>":""} ${prompt.message}\n*by ${prompt.pingable? `<@${prompt.author}>`: prompt.author}.`,{disableEveryone:true})
            .then((promptMessage)=>{
                promptMessage.prompt = prompt;
                if(message.guild){
                    data['prompts'].splice(data[`prompts`].data.indexOf(prompt),1);
                    promptMessage.react("👍").then(()=>promptMessage.react("👎")).then(()=>promptMessage.react("🚫"));
                    unreadyPrompt(promptMessage,data);

                    let thumbDownFilter = (reaction) => {return reaction.emoji.name=="👍"}
                    let deleteFilter = (reaction,user) => {return reaction.emoji.name=="👎" || (reaction.emoji.name=="🚫" && (message.author.id === user.id || message.channel.permissionsFor(user).has('MANAGE_MESSAGES')))};

                    /* 🚫,👎 */
                    promptMessage.awaitReactions(deleteFilter,{time: 1000*60*5,errors:['time']})//first 5 minutes of deleting is special
                    .then((collected) => {
                        if(collected.some((reaction,index)=>{reaction.emoji.name == '🚫'}) || promptMessage.reactions.find("emoji.name",'👎').count >= 6 ) 
                            promptMessage.delete();
                            readyPrompt(promptMessage,data);
                    })
                    .catch(()=>{
                        promptMessage.awaitReactions(deleteFilter,{time: 1000 * 60 * 25}) //for the remainder of half an hour
                        .then((collected)=>{
                            if(collected.some((reaction,index)=>{reaction.emoji.name == '🚫'}) || promptMessage.reactions.find("emoji.name",'👎').count >= 6 ) 
                            let temp = promptMessage.content.replace("~~","");
                            promptMessage.edit(`~~${temp}~~`).then((x)=>{promptMessage.clearReactions().then(null,null)});
                            readyPrompt(promptMessage,data);
                        })
                    });
                    /* 👍 */
                    promptMessage.awaitReactions(thumbUpFilter,{max:5,time: 1000 * 60 * 60})
                    .then((collected)=>{
                        if(collected.size >= 5)
                            promptMessage.channel.send("I heard you all, prompt has been saved for later use!");
                            readyPrompt(promptMessage,data);
                            let newPrompt = prompt;
                            newPrompt.author = "popular vote";
                            newPrompt.pingable = false;
                            addPrompt(newPrompt,data);
                        })
                    .catch(()=>{ //after an hour, just ready the channel.
                        readyPrompt(promptMessage,data);
                    })
                }
            })
        }
    },/*
    "generate": {
        description: "Generates a random prompt.",
        parameters: [],
        method: function (message, data) {

            if (isPromptChannel(message, data) == false) {
                return; // If this channel is not set up for prompts, do not respond.
            }
        }
    },*/
    "markpromptchannel": {
        description: "Mark or unmark this channel as available for entering prompts.",
        parameters: [],
        method: function (message, data) {
            if (message.guild == undefined) {
                return;
            }

            let member = message.member;
            let channel = message.channel;

            if (channel.permissionsFor(member).has("MANAGE_MESSAGES")) {
                if (data['channels'].data[channel.id]) {
                    delete data['channels'].data[channel.id];
                } else {
                    data['channels'].data[channel.id] = {timestamp:0,messageId:0};
                }
                channel.send(`Channel ${data['channels'].data[channel.id] ? "marked" : "unmarked"} for prompts!`);
            } else {
                channel.send("You do not have the 'Manage Messages' permission for this channel and therefore can't mark it.");
            }

        }
    },
    "submit": {
        description: "Use this to submit a prompt.",
        parameters: ["prompt"],
        method: function (message, data, filteredcontent) {
            if (message.guild) {
                return;
            }

            /*

            check if the user has available prompt slots
            filter out mentions
            Confirm with prompt.
            */

        }
    },
    "myprompts": {
        description: "Check your prompts.",
        parameters: [],
        method: function (message, data) {
            if (message.guild) {
                return;
            }

            /*
            show all prompts from that user
            */
        }
    },
    "feedback": {
        description: "Sends some feedback to the bot developer.",
        parameters: ["message"],
        method: function (message, data, filteredcontent) {
            if (isPromptChannel(message, data))
                message.client.fetchUser(message.client.config.botowner, true)
                .then((user) => {
                    user.send(`${message.author}: ${filteredcontent}`).then(() => {
                        message.channel.send("I've passed along your feedback.")
                    }).catch();
                }).catch();
        }
    }
}

function isPromptChannel(message, data) {
    return (message.guild == undefined || data['channels'].data.hasOwnProperty(message.channel.id));
}
function readyPrompt(ourMessage, data){
    data['channels'].data[ourMessage.channel.id].timestamp = 0;
    data['channels'].data[ourMessage.channel.id].messageId = 0;
}
function unreadyPrompt(ourMessage, data){
    data['channels'].data[ourMessage.channel.id].timestamp = Date.now();
    data['channels'].data[ourMessage.channel.id].messageId = ourMessage.id;
}
function canPrompt(message,data){
    return data['channels'].data[message.channel.id].timestamp + 1000* 60 * 60 < Date.now();
}
function addPrompt(prompt,data){
    data["prompts"].data.push(prompt);
}