const Discord = require('discord.js');
const client = new Discord.Client();
const creds = require('./creds.json');
const r = require('request');

let url = "https://fantasy.fifa.com/services/api/feed/players?gamedayId=1&optType=1&language=en&buster=default";

async function search_player(target, message){

	r(url, {json: true}, (err, res, body) => {

		console.log(body.Data);
		let players = body.Data.Value.playerList;

		if (err){ 
			return console.log(err);
		}

		else{
			players.forEach( function(player) {
				if (player.PlayerFullName == target){

					let player_embed = new Discord.RichEmbed();

					player_embed.setTitle(`${player.PlayerDisplayName}`);
					player_embed.setFooter('fantasy.fifa.com', 'https://api.fifa.com/api/v1/picture/tournaments-sq-4/254645_w');

					// player_embed.addField('\u200B', `Goals: ${player.goalScored}`);
					// player_embed.addField('\u200B', `Assists: ${player.goalAssist}`);
					// player_embed.addField('\u200B', `Position: ${player.skillDesc}`);

					// player_embed.addField('\u200B', `Goals: ${player.goalScored}` + '\n' + `
					// 						Assists: ${player.goalAssist}` + '\n' + `
					// 						Poistion: ${player.skillDesc}` + '\n' + `
					// 						Country: ${player.TeamName}`);

					player_embed.addField('\u200B', `Goals: ${player.goalScored}` + '\n' + `Assists: ${player.goalAssist}` + '\n' + `Poistion: ${player.skillDesc}` + '\n' + `Country: ${player.TeamName}`);

					player_embed.setThumbnail("https://www.fifa.com/assets/img/tournaments/common/player-placeholder--sqr.jpg");


					console.log(player_embed);

					message.channel.send(player_embed);
				}
			});
		}
	});
}

function callback(param){
	return param;
}

client.on('ready', () => {
	console.log(`${client.user.tag} running.`);
});

client.on('message', (message) => {
	if (message.content.startsWith('>>wc')){
		target = message.content.replace('>>wc ', '');
		search_player(target, message);
	}
});


client.login(creds.discord_token);