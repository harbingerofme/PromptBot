module.exports = {
    "prompt": {
        description: "Gives out a user submitted prompt.",
        parameters: [],
        method: function (message, data) {
            let response = "";
            if (message.guild && !data['channels'].data[message.channel.id]) {
                return;// If this channel is not set up for prompts, do not respond.
            }
            else {
                if (message.guild) {
                    /*TO DO:
                    check if time has elapsed.
                    if so, set a new time.
                    */
                }
            }
            /* TO DO:
            select a prompt
            respond with prompt
            if it's not private, clear that prompt from the list.
            */
        }
    },
    "generate": {
        description: "Generates a random prompt.",
        parameters: [],
        method: function (message, data) {

            if (message.guild && data['channels'].data[message.channel.id]) {
                return;// If this channel is not set up for prompts, do not respond.
            }

            /* TO DO:
            everything
            */
        }
    },
    "markpromptchannel": {
        description: "Mark or unmark this channel as available for entering prompts.",
        parameters: [],
        method: function (message, data) {
            if (message.guild == undefined) { return; }

            let member = message.member;
            let channel = message.channel;

            if (channel.permissionsFor(member).has("MANAGE_MESSAGES")) {
                if (data['channels'].data[channel.id]) {
                    data['channels'].data[channel.id] = false;
                }
                else {
                    data['channels'].data[channel.id] = true;
                }
                channel.send(`Channel ${data['channels'].data[channel.id] ? "marked" : "unmarked"} for prompts!`);
            }
            else
            {
                channel.send("You do not have the 'Manage Messages' permission for this channel and therefore can't mark it.");
            }

        }
    },
    "submit": {
        description: "Use this to submit a prompt.",
        parameters: ["prompt"],
        method: function (message, data, filteredcontent) {
            /*
            only private messages

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
            /*
            only private messages

            show all prompts from that user
            */
        }
    },
    "feedback": {
        description: "Sends some feedback to the bot developer.",
        parameters: ["message"],
        method: function (message, data, filteredcontent) {
            client.fetchUser(config.botowner, true)
                .then((user) => {
                    user.send(`<@${message.author}>: ${filteredcontent}`).then(null, null);//TO DO: proper error handling
                })
                .catch(
                    //TO DO: proper error handling
                )
        }
    }
}