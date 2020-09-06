require('dotenv').config()
const Telegraf = require('telegraf')
const api = require('covid19-api')
const Markup = require('telegraf/markup')
const COUNTRIES_LIST = require('./country');

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) =>
    ctx.reply(`
Привет, я БЕНИШКА! Для тебя ${ctx.message.from.first_name}, расскажу все о COVID-19...
Введи на английском название страны и получи статистику.
Посмотреть весь список стран можно командой /help.`,
        Markup.keyboard([
            ['US', 'Russia'],
            ['Ukraine', 'Kazakhstan'],
        ])
            .resize()
            .extra()
    )
)

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
    let data = {}
    try {
        data = await api.getReportsByCountries(ctx.message.text);
        const formatData = `
Страна: ${data[0][0].country}
Флаг: ${data[0][0].flag}
Случаи: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}`;
        ctx.reply(formatData);
        // console.log(data);
    } catch (e) {
        ctx.reply('По данной стране нет данных или вы ввели неверно название страны, посмотрите поддерживаемые страны командой /help.');
    }
})

bot.hears('hi', (ctx) => ctx.reply('Привет всем!'))
bot.startPolling()
console.log('BOT is reade!!!')