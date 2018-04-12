/**
 * shop mp
 */

const model = require('../model')

class ShopMediaPlatform {
    constructor(shopId, appId) {
        this.shop_id = shopId
        this.app_id = appId
    }

    async create() {
        return model.weixin.shop_mps.create({
            shop_id: this.shop_id,
            app_id: this.app_id
        })
    }
}

module.exports = ShopMediaPlatform