const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const user = require('../models/user');
const { validateAppleSignin } = require('../validations/socialAuth/socialAuthValidation');

const client = jwksClient({
    jwksUri: 'https://appleid.apple.com/auth/keys',
    // requestHeaders: {}, // Optional
    // timeout: 30000 // Defaults to 30s
});

function getAppleSigninKeys(kid) {
    return new Promise((resolve, reject) => {
        client.getSigningKey(kid, (err, key) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(key);
            }
        });
    });
}

function verifyJwt(json, publicKey) {
    return new Promise((resolve, reject) => {
        jwt.verify(json, publicKey, (err, payload) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(payload);
        });
    });
}

const createToken = (id) => {
    return jwt.sign(
        {
            id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
};

module.exports = {
    signinWithApple: async (req, res) => {

        //validate incoming data
        const dataValidation = await validateAppleSignin(req.body);
        if (dataValidation.error) {
            const message = dataValidation.error.details[0].message.replace(/"/g, "");
            return res.json({
                error: true,
                message: message,
                data: {}
            });
        }

        const { idToken, user } = req.body;

        const json = jwt.decode(idToken, { complete: true });

        if (!json) {
            return res.status(200).json({
                error: true,
                message: 'Invalid token',
                data: {}
            });
        }

        const kid = json.header.kid;

        const appleKey = await getAppleSigninKeys(kid);

        if (!appleKey) {
            return res.json({
                error: true,
                message: 'Error getting apple key',
                data: {}
            })
        }

        const payload = await verifyJwt(idToken, appleKey);

        if (!payload) {
            console.error('Error verifying apple key');
            return res.json({
                error: true,
                message: 'Error verifying apple key',
                data: {}
            })
        }

        console.log('Signin with apple successful!', payload);

        if (payload.sub === user && payload.aud === process.env.APPLE_AUD) {
            // correct user
            // correct authentication against app

            // save user to database
            const userDetails = {
                email: payload["email"],
            };

            let existing = await user.findOne({ email: userDetails.email });
            if (existing) {
                let toScreen;

                // user exists
                if (existing.phone) {
                    toScreen = 1;
                }
                // user exists without phone (registration not completed)
                else {
                    toScreen = 0;
                }

                const token = createToken(existing._id);
                return res.status(200).json({
                    error: false,
                    message: "Verified",
                    data: {
                        token: token,
                        toScreen,
                    },
                });
            } else {
                // -- logic for adding customerId
                // finding all users having customerId
                let allUsers = await user.find({ customerId: { $exists: true } });

                let newCustomerId = "";

                var dateVar = new Date();
                let lastTwoDigitsOfYear = dateVar.getFullYear().toString().substr(-2);
                let twoDigitMonth = ("0" + (dateVar.getMonth() + 1)).slice(-2);

                if (allUsers.length) {
                    // last customerId
                    let lastUserId = allUsers[allUsers.length - 1].customerId;

                    // splitted with spaces
                    let splittedCustomerId = lastUserId.split(" ");

                    let newCount =
                        parseInt(splittedCustomerId[splittedCustomerId.length - 1]) + 1;

                    newCustomerId = `UIN MDFL ${lastTwoDigitsOfYear} ${twoDigitMonth} ${newCount}`;
                } else {
                    newCustomerId = `UIN MDFL ${lastTwoDigitsOfYear} ${twoDigitMonth} 12000`;
                }

                let userDocument = new user({
                    name: userDetails.firstname,
                    email: userDetails.email,
                    customerId: newCustomerId,
                });

                userDocument.save().then((response) => {
                    console.log('saved user', response);
                    const token = createToken(response._id);

                    return res.status(200).json({
                        error: false,
                        message: "Verified",
                        data: {
                            token: token,
                            toScreen: 0,
                        },
                    });
                });
            }

        } else {
            console.error('Invalid user');
            return res.json({
                error: true,
                message: 'Invalid user or aud authentication failed',
                data: {}
            })
        }
    }
}