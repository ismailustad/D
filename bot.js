const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const db = require('quick.db');
const http = require('http');
const express = require('express');
const moment = require("moment");
const app = express();
require("moment-duration-format");
app.get("/", (request, response) => {
console.log("ArdaDemr | Hostlandı");
response.sendStatus(200);
});
app.listen(8000);
setInterval(() => {
http.get(`http://ozelfyukas.glitch.me/`);
}, 280000)
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
client.on(`guildMemberAdd`, async member => {
  const e = new Discord.RichEmbed()
    .setColor(`RANDOM`)
    .setImage(`https://media.giphy.com/media/fu2DK2kjCKwZQMF5Da/giphy.gif`)
    .addField(`Sunucumuza geldiğin için teşekkür ederim!`, `Fyukas iyi eğlenceler diler`)
    .setFooter(`Fyukas`)
  member.send(e);
});
//----------------------Özelden hoşgeldin mesajı SON----------------------\\
//-----------------------------Süreli Yazı-----------------------------//
setInterval(() => {                       
  var embed = new Discord.RichEmbed()
                        .setColor(`#303136`)
                        .setDescription(`**Level Sistemimiz Aktif!** \n\nSende Discord Sunucumuzda Yazışarak Levelini Yükseltebilirsin. \nSadece 15 Saniye Arayla XP Gelir SPAM Atmayınız.`)
                        .addField(`Level Kasarsam Elime Ne Geçecek?`,`Level Kasarsan Aktif Olduğunu Anlarız \nVe Sunucumuzda Rol Sahibi Olmaya Hak Kazanırsın.`)
                        .addField(`Levelimi Nasıl Görürüm?`,`!rank yazarak levelini görebilirsin.! \nBu komut sadece <#657990555846049808> Bölümünde Çalışır`)
                        .addField(`Toplu Sıralamayı Nasıl Görürüm?`,`!levels yazarak sunucumuzun level sıralamasını görebilirsin.! \nBu komut sadece <#657990555846049808> Bölümünde Çalışır`)
                        .setImage(`https://media.giphy.com/media/fV28PNftkihVR7y1Bk/giphy.gif`)
     client.channels.get("657989703907147777").send(embed).then(msg => msg.delete(180000));
}, 360000)
//-----------------------------Süreli Yazı Son-----------------------------//
client.on("message", async (message) => {
if(message.author.bot || message.channel.type === "dm") return;
  let sChannelanan = message.guild.channels.find(c => c.name === "log")
  let embed = new Discord.RichEmbed()
  .setColor("GREEN")
  .setAuthor(`Mesaj Gönderildi`, message.author.avatarURL)
  .addField("Kullanıcı", message.author)
  .addField("Mesaj", message.content, true)
  .addField("Kanal Adı", message.channel.name, true)
  .addField("Mesaj ID", message.id, true)
  .addField("Kullanıcı ID", message.author.id, true)
  .setThumbnail(message.author.avatarURL)
  .setFooter(`Bilgilendirme  • bügün saat ${message.createdAt.getHours()+3}:${message.createdAt.getMinutes()}`, `${client.user.displayAvatarURL}`)
  sChannelanan.send(embed)
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
if(newMessage.author.bot || newMessage.channel.type === "dm") return;
  let sChannelanan = newMessage.guild.channels.find(c => c.name === "log")
  if (oldMessage.content == newMessage.content) return;
  let embed = new Discord.RichEmbed()
  .setColor("GREEN")
  .setAuthor(`Mesaj Düzenlendi`, newMessage.author.avatarURL)
  .addField("Kullanıcı", newMessage.author)
  .addField("Eski Mesaj", oldMessage.content, true)
  .addField("Yeni Mesaj", newMessage.content, true)
  .addField("Kanal Adı", newMessage.channel.name, true)
  .addField("Mesaj ID", newMessage.id, true)
  .addField("Kullanıcı ID", newMessage.author.id, true)
  .setThumbnail(newMessage.author.avatarURL)
  .setFooter(`Bilgilendirme  • bügün saat ${newMessage.createdAt.getHours()+3}:${newMessage.createdAt.getMinutes()}`, `${client.user.displayAvatarURL}`)
  sChannelanan.send(embed)
});
client.on("messageDelete", async (deletedMessage) => {
if(deletedMessage.author.bot || deletedMessage.channel.type === "dm") return;
  let sChannelanan = deletedMessage.guild.channels.find(c => c.name === "log")
  let embed = new Discord.RichEmbed()
  .setColor("GREEN")
  .setAuthor(`Mesaj Silindi`, deletedMessage.author.avatarURL)
  .addField("Kullanıcı", deletedMessage.author)
  .addField("Silinen Mesaj", deletedMessage.content, true)
  .addField("Kanal Adı", deletedMessage.channel.name, true)
  .addField("Mesaj ID", deletedMessage.id, true)
  .addField("Kullanıcı ID", deletedMessage.author.id, true)
  .setThumbnail(deletedMessage.author.avatarURL)
  .setFooter(`Bilgilendirme  • bügün saat ${deletedMessage.createdAt.getHours()+3}:${deletedMessage.createdAt.getMinutes()}`, `${client.user.displayAvatarURL}`)
  sChannelanan.send(embed)
});
   
//-------------------GÜVENLİK
client.on('guildMemberAdd',async member => {
  let user = client.users.get(member.id);
  let chan = client.channels.get(db.fetch(`guvenlik${member.guild.id}`)) 
       const Canvas = require('canvas')
       const canvas = Canvas.createCanvas(360,100);
       const ctx = canvas.getContext('2d');
  
  const resim1 = await Canvas.loadImage('https://cdn.discordapp.com/attachments/591299755976425493/614151181752860672/yhosgeldirrn.png')
    const resim2 = await Canvas.loadImage('https://cdn.discordapp.com/attachments/591299755976425493/614164419768877056/yhosgeldirrn.png')
    const kurulus = new Date().getTime() - user.createdAt.getTime();
    const gün = moment.duration(kurulus).format("D")   
    var kontrol;
      if (kurulus > 2629800000) kontrol = resim2
    if (kurulus < 2629800000) kontrol = resim1

       const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/591299755976425493/614164413318168606/Adsz.png');
       ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
   


  const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
  ctx.drawImage(kontrol,0,0,canvas.width, canvas.height)
  ctx.beginPath();
    ctx.lineWidth = 4;
  ctx.fill()
    ctx.lineWidth = 4;
  ctx.arc(180, 46, 36, 0, 2 * Math.PI);
    ctx.clip();
  ctx.drawImage(avatar, 143,10, 73, 72  );

   
       const attachment = new Discord.Attachment(canvas.toBuffer(), 'STARKs-güvenlik.png');
    chan.send(attachment)
});