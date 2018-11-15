module.exports = {
    "prompt":{
        description: "Gives out a user submitted prompt.",
        parameters: [],
        method: function(message,guildData){            
            let response = "";
            if(message.guild && !(guildData.hasOwnProperty(message.guild.id) && guildData[message.guild.id].includes(message.channel.id) ){
                return;// If this channel is not set up for prompts, do not respond.
            }
            else{
                if(message.guild){
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
    "generate":{
        description: "Generates a random prompt.",
        parameters: [],
        method: function(message,guildData){

            if(! (guildData.hasOwnProperty(message.guild.id) && guildData[message.guild.id].includes(message.channel.id) ){
                return;// If this channel is not set up for prompts, do not respond.
            }

            /* TO DO:
            everything
            */
        }
    },
    "markpromptchannel":{
        description: "Mark or unmark this channel as available for entering prompts.",
        parameters: [],
        method: function(message,guildData){
            if(message.guild == undefined)
                return;
            
            /* TO DO:
            everything
            */
        }
    },
    "submit":{
        description: "Use this to submit a prompt.",
        parameters: ["prompt"],
        method: function(message,guildData, filteredcontent){
            /*
            only private messages

            check if the user has available prompt slots
            filter out mentions
            Confirm with prompt.
            */

        }
    },
    "myprompts":{
        description: "Check your prompts.",
        parameters: [],
        method: function(message,guildData){
            /*
            only private messages

            show all prompts from that user
            */
        }
    },
    "feedback":{
        description: "Sends some feedback to the bot developer.",
        parameters: ["message"],
        method: function(message,guildData, filteredcontent){
            client.fetchUser(config.botowner,true)
                .then((user)=>{
                    user.send(`<@${message.author}>: ${filteredcontent}`).then(null,null);//TO DO: proper error handling
                })
                .catch(
                    //TO DO: proper error handling
                )
        }
    }
}