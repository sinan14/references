const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateScratchCoupon = (data)=>{

    const Schema = Joi.object({
        couponId: Joi.objectId().required().label('Coupon').messages({'string.pattern.name':'Invalid coupon ID.'})
    })

    return Schema.validate(data)
}

module.exports = validateScratchCoupon;