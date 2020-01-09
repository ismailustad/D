const Discord = require('discord.js');

exports.run = async(client, message, args) => {
  
  if (!message.member.hasPermission("MANAGE_ROLES")){
    const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username, message.author.avatarURL)
    .setColor('RED')
    .addField('👥 Role Sahip Kullanıcılar', role.members.size, true)
    message.channel.send(embed)
      }
    
 };

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["uyarılar"],
  permLevel: 0,
}

exports.help = {
  name: 'uyarılar',
  description: 'Etiketlediğiniz rol hakkında bilgi alırsınız.',
  usage: 'rol-bilgi [rol]'
};