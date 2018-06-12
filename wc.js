const Discord = require('discord.js');
const client = new Discord.Client();
// const creds = require('./creds.json');
const r = require('request');
const flags = require('./flag_dict.json');

let url = "https://fantasy.fifa.com/services/api/feed/players?gamedayId=1&optType=1&language=en&buster=default";

async function search_player(target, message){

	r(url, {json: true}, (err, res, body) => {

		let players = body.Data.Value.playerList;

		if (err){ 
			return console.log(err);
		}

		else{
			players.forEach( function(player) {
				if (player.PlayerFullName == target){
					try{

						let player_embed = new Discord.RichEmbed();
						let nextMatch = player.UpComingMatchesList[0];
						let oppCtryShort = nextMatch.VsCountryCode;
						let plrCtryShort = player.teamShortCode;

						let plrFlag = flags[plrCtryShort];
						let oppFlag = flags[oppCtryShort];
						
						player_embed.setTitle(`${player.PlayerDisplayName}`);
						player_embed.setColor('0x990001');
						player_embed.setFooter('fantasy.fifa.com', 'https://api.fifa.com/api/v1/picture/tournaments-sq-4/254645_w');
						player_embed.addField('Stats', `Goals: ${player.goalScored}` + '\n' + `Assists: ${player.goalAssist}` + '\n' + `Position: ${player.skillDesc}` + '\n' + `Country: ${plrFlag} (${player.TeamName})` + '\n' + `Captained: ${player.PlayerCapCount} (${player.SelectedCapPer}%)` + '\n' + `Gameday Pts: ${player.CurrGamedayPoints}` + '\n' + `Selected By: ${player.SelectedPercentage}%` + '\n' + `Value: €${player.value}M`);
						player_embed.addBlankField();
						player_embed.addField(`\nNext Game: ${oppFlag} (${oppCtryShort})`, `\nKick-off: ${player.UpComingMatchesList[0].MatchDate}`, true);
						player_embed.setThumbnail(`https://fantasy.fifa.com/static-assets/headshots-test/${player.Id}.png`);
						// thumbnail must be 400x300 ish, current size is 600x600. Need smaller thumbail.
						message.channel.send(player_embed);
					}

					catch(err){
						console.log(err);
						message.channel.send("Could not find player");
					}

				}
			});
		}
	});
}

async function show_help(message){
	let help = new Discord.RichEmbed();
	help.setTitle("Fantasy WC Bot");
	help.setColor("0x990001");
	help.setFooter("fantasy.fifa.com", "https://api.fifa.com/api/v1/picture/tournaments-sq-4/254645_w");
	help.addField("\u200B", "Type >> {full player name} to see details for a player.\nPlayer must be in 2018 World Cup.");
	help.addField("\u200B" "For example, >> Cristiano Ronaldo or >> Neymar\n\nPlayer name must be spelled properly, unlike FantasyPL Bot (at the moment).");

	message.channel.send(help);
}

client.on('ready', () => {
	console.log(`${client.user.tag} running.`);
});

client.on('message', (message) => {
	if (message.content.startsWith('>> ')){
		target = message.content.replace('>> ', '');
		search_player(target.toUpperCase(), message);
	}
	else if (message.content.startsWith('>>help')){
		show_help(message);
	}
});


client.login(process.env.BOT_TOKEN);
