// Heroku shit
const express = require("express");
const app = express();

var port = process.env.PORT || 8080;
var server = app.listen(port,function() {
    console.log("app running on port 8080");
});

// Bibliotecas
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});

// Depois que o bot carregou
bot.on("ready", async() => {
    console.log(`${bot.user.username} is online!`);
})

// Gerenciamento das mensagens
bot.on("message", async message => {
    // Ignorar caso mensagem seja do bot
    if (message.author.bot) return;
    // Ignorar mensagens privadas (dm)
    if (message.channel.type == "dm") return;
    // Ignorar mensagens de outros canais
    if (message.channel.name != "geral") return;
    //if (message.author.username == "snipa") return;

    // Gerenciando os args
    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    // Lista de objetos com os comandos
    let comandos = [
        {
            'comando': '!healer',
            'cargo': 'Healer'
        },
        {
            'comando': '!tank',
            'cargo': 'Tank'
        },
        {
            'comando': '!dps',
            'cargo': 'Dps'
        }
    ];

    // Verificar se é um comando válido
    if (comandos.find(x => x.comando === cmd)){
        // Nome do cargo em string
        const cargo_n = comandos.find(x => x.comando === cmd).cargo;
        // Objeto contendo a role
        const role = message.guild.roles.find(r => r.name === cargo_n);
        // Alvo a receber as ações
        const target = message.member;
        
        if (target.roles.find(r => r.name === cargo_n)) {
            // Remover cargo
            target.removeRole(role);

            // Enviar mensagem privada avisando que o cargo foi removido
            let embed = new Discord.RichEmbed()
            .setColor("#15f153")
            .addField(cargo_n, `Cargo de ${cargo_n} removido!`)
            target.send(embed);
        } else {
            // Adicionar cargo
            target.addRole(role);
            
            // Enviar mensagem privada avisando que o cargo foi adicionado
            let embed = new Discord.RichEmbed()
            .setColor("#15f153")
            .addField(cargo_n, `Cargo de ${cargo_n} adicionado!`)
            target.send(embed);
        }
    }

    // Apagar mensagem
    message.delete(500);
});

// Realizar login seguro com token no env de runtime
bot.login(process.env.token);