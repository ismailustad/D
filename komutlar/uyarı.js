const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {

    if (!message.member.hasPermissions ('KICK_MEMBERS')) return message.channel.send("Komudu Kullanmak İçin Kick Members Yetkisine Sahip Olmalısın.")
    const mod = message.author;
    let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!user) return message.channel.send(`:x: Kullanıcıyı Bulamıyorum`)
    let reason = message.content.split(" ").slice(2).join(" ");
    if (!reason) return message.channel.sendEmbed(new Discord.RichEmbed().setAuthor('Hata').setDecription('Uyarı Sebebini Yazman Gerek').setColor('RANDOM'))
    let uyarrole = message.guild.roles.find(`name`, "Uyarı");
  if (!uyarrole) {
        try {
            uyarrole = await message.guild.createRole({
                name: "Uyarı",
                color: "#000000",
                permissions: []
            })
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(uyarrole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }

    await (user.addRole(uyarrole.id));
    const muteembed = new Discord.RichEmbed()
            .addField('Kullanıcı', `<@${user.id}>`)
            .addField('Sebep', `**${reason}**`)
            .addField('Uyaran', `${mod}`)
            .setColor('RANDOM')
        message.channel.send(muteembed)
  
  
}


exports.conf = {
    aliases: ['uyar'],
    permLevel: 2
};

module.exports.help = {
    name: "uyar",
    description: "Etiketlenen Kişiye Mute Atar",
    usage: "mute [kullanıcı] [sebep]"
}