const jwt = require('jsonwebtoken')

const jwtTest = async () => {
    try {
        // create a jwt payload -- the data that is encoded
        const payload = {
            // public user information
            name: 'weston',
            id: '1234',
            email: 'w@b.com'
            // do not put the password in the payload!
        }
        // 'sign' jwt by supplying a secret to hash in the signature
        const secret = 'my super big secret'
        // jwt.sign(payload to encode, 'secret to create signature),expiresin
        const token = jwt.sign(payload, secret)
        console.log(token)
        // head (specific encoding standard for the jwt): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
        // payload (encoded data):eyJuYW1lIjoid2VzdG9uIiwiaWQiOiIxMjM0IiwiZW1haWwiOiJ3QGIuY29tIiwiaWF0IjoxNjY1MDgyMjQzfQ.
        // signature (hash of the payload and secret);QLpQ9seZ5WnjsCiZHci5dg2mW9eXMPDeYfInUNHE3c8

        // signing a token will log a user in 
        // jwt.verify(token, secret) -- throws an error if it cannot verify (otherwise returns decoded data to us)
        const decode = jwt.verify(token, secret)
        // when we decode jwts we will check the signature to make sure the suer's login 
        console.log(decode)
        // is valid, this authorizes the user

    } catch(err) {
        console.log(err)
    }
}

jwtTest()