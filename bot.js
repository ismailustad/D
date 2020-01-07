const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};


client.on('message', msg => {
  if (msg.content.toLowerCase() === 'sa') {
    msg.reply('Aleyküm selam,  hoş geldin ^^');
  }
});

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

//----------------------------------------------------------------------------\\

//-----------------------------------------------------------------------------\\
client.on('guildMemberAdd', member => {
  let guild = member.guild;
  const channel = member.guild.channels.find('name', '✅│giriş-çıkış');
  if (!channel) return;
  const embed = new Discord.RichEmbed()
  .setColor('#e7a3ff')
        .addField(`Kullanıcı İsmi`,`${member.user.username}`)   
        .addField(`Kullanıcı Tagı`,`#${member.user.discriminator}`)
        .addField(`Kullanıcı Etiket`,`${member}`)
        .addField(`Kullanıcı ID`,`${member.user.id}`)
        .addField(`Kullanıcı Kayıt tarihi`,`${member.user.createdAt}`)
        .addField(`${member.user.username} , ile beraber toplam`,`${member.guild.memberCount} kişi olduk.`)
        .addField(`Kullanıcı Bot mu?`, `${member.user.bot ? '\n Evet' : 'Hayır'}`)
        .addField(`Şu an oynadığı oyun`, `${member.user.presence.game ? member.user.presence.game.name : `Şu an oyun oynamıyor`}`)
        .setFooter(`Fyukas Sunucusuna Katılma Saati --->`)
        .setThumbnail(member.user.avatarURL)
        .setImage(`https://i.hizliresim.com/Z5bgoA.png`)
  .setTimestamp()
  channel.sendEmbed(embed); 
});

client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.find('name', '✅│giriş-çıkış');
  if (!channel) return;
  const embed = new Discord.RichEmbed()
  .setColor('#e7a3ff')
        .addField(`Kullanıcı İsmi`,`${member.user.username}`)   
        .addField(`Kullanıcı Tagı`,`#${member.user.discriminator}`)
        .addField(`Kullanıcı Etiket`,`${member}`)
        .addField(`Kullanıcı ID`,`${member.user.id}`)
        .addField(`Kullanıcı Kayıt tarihi`,`${member.user.createdAt}`)
        .addField(`${member.user.username} , ile beraber toplam`,`${member.guild.memberCount} kişi olduk.`)
        .addField(`Kullanıcı Bot mu?`, `${member.user.bot ? '\n Evet' : 'Hayır'}`)
        .addField(`Şu an oynadığı oyun`, `${member.user.presence.game ? member.user.presence.game.name : `Şu an oyun oynamıyor`}`)
        .setFooter(`Fyukas Sunucusundan Ayrılma Saati --->`)
        .setThumbnail(member.user.avatarURL)
        .setImage(`https://i.hizliresim.com/4pBRQQ.png`)
  .setTimestamp()
  channel.sendEmbed(embed); 
});

//----------------------FAKE KATIL AYRIL----------------------\\
client.on('message', async message => {
if (message.content === '/fake katıl') {
  client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
    }
});
client.on('message', async message => {
    if (message.content === '/fake ayrıl') {
        client.emit('guildMemberRemove', message.member || await message.guild.fetchMember(message.author));
    }
});
//----------------------FAKE KATIL AYRIL SON----------------------\\

//----------------------Özelden hoşgeldin mesajı----------------------\\

//----------------------Özelden hoşgeldin mesajı SON----------------------\\