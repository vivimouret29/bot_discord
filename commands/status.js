module.exports = {
    name: 'status',
    description: 'a dynamic status',
    execute(message, args) {
        const Discord = require('discord.js');
        const client = new Discord.Client();

        const stOnOff = args[0]
        const typeThings = args[1]
        const nameText = args[2]
        const urlLike = args[3]

        if (message.author.id === '431915542610313217') {
            client
                .on('ready', () => {
                    client.user.setPresence({
                        activity: {
                            name: `${nameText}`,
                            type: `${typeThings}`,
                            url: `${urlLike}`
                        },
                        status: `${stOnOff}`
                            .catch(
                                console.error,
                                message.channel.send(`problème avec ton status`)
                            )
                    });
                })
                .on('debug', console.log);
            message.delete().catch(O_o => { })
            message.channel.send('changement d\'activité !')
        }
    }
};