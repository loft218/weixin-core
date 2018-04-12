/**
 * 
 */
const assert = require('assert')
const MediaPlatform = require('../lib/media_platform')
const ShopMediaPlatform = require('../lib/shop_mp')

module.exports = {
    saveMediaPlatform: async (ctx) => {
        const _appId = ctx.body.app_id
        assert(_appId, 'app_id missed')

        let mp = new MediaPlatform(_appId)
        mp = await mp.save(ctx.body)

        ctx.body = {
            ok: 1
        }
    },
    addShopMediaPlatform: async (ctx) => {
        const _shopId = ctx.body.shop_id
        const _appId = ctx.body.app_id
        assert(_shopId, 'shop_id missed')
        assert(_appId, 'app_id missed')

        let smp = new ShopMediaPlatform(_shopId, _appId)
        await smp.create()

        ctx.body = {
            ok: 1
        }
    }
}