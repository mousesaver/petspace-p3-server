const bcrypt = require('bcryptjs')
const { createHash } = require('crypto')
const hash = createHash('sha256')
hash.update('hello')
const digest = hash.digest('hex')
console.log(digest)
const testCrypto = async () => {
    try {
        // when a user is registering, we need to make a hash of their password
        // test password hash
        const password = 'hello'
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        console.log(hashedPassword)
        // when a user is logging in, we need to test the password that supply against a hash that we have stored in the database
        // test comparing hashes
        // bcrypt.compare('string to match', hash to match)
        const matchPasswords = await bcrypt.compare('hello1', hashedPassword)
        console.log(matchPasswords)
    } catch(err) {
        console.log(err)
    }
}

testCrypto()