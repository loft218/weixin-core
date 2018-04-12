/**
 * koa app
 */
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const log4js = require('log4js')
const logger = log4js.getLogger('app')
const morgan = require('koa-morgan')
//koa app
const app = new Koa()
app.use(bodyParser())
app.use(morgan('tiny'))

app.use(async (ctx, next) => {
    try {
        ctx.body = ctx.request.body
        await next()
    }
    catch (e) {
        logger.error(e.stack || e)
        ctx.status = 500
        ctx.body = {
            err_msg: e.message || 'server error'
        }
    }
})

require('./routes')(app)

app.use(async (ctx) => {
    ctx.status = 404
    ctx.body = { err_msg: '404' }
})

module.exports = app