/**
 * app routes
 */

const route = require('koa-route')

const controllers = require('./controllers')

module.exports = (app) => {
    //admin routers
    app.use(route.post('/admin/mp', controllers.admin.saveMediaPlatform))
    app.use(route.post('/admin/shop/mp', controllers.admin.addShopMediaPlatform))

    //mp routers
    app.use(route.get('/mp/token', controllers.media_platform.getAccessToken))
    app.use(route.get('/mp/js_ticket', controllers.media_platform.getJsTicket))
    app.use(route.get('/mp/js_sign', controllers.media_platform.getJsSign))
    app.use(route.get('/mp/user_token', controllers.media_platform.getUserAccessToken))
    app.use(route.get('/mp/user', controllers.media_platform.getUserInfoByAccessToken))

    //user routers
    app.use(route.get('/user', controllers.wx_user.getUser))
}