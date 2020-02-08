const Discord = require('discord.js');
const db = require('quick.db')

exports.run = async (bot, message) => {
  if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(` Bu komudu kullanabilmek için "Sunucuyu Yönet" yetkisine sahip olman gerek.`)
   let c = message.mentions.channels.first()
   if (!c) return message.channel.send('Lütfen bir kanal etiketleyiniz.')
   db.set(`guvenlik${message.guild.id}`, c.id)
   message.channel.send(':tick: | Güvenlik kanalı başarıyla ayarlandı.')
}

module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['gks','güvenlik'],
  permLevel: 0
};

module.exports.help = {
  name: 'güvenlik',
  description: 'guvenlik',
  usage: 'güvenlik-ayarla'
};