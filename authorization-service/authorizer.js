export const basicAuthorizer = async (event) => {
    const token = event.headers.authorization;

    if(!token) {
        throw new Error("Unauthorized")
    }

    const encoded = token.replace('Basic ', '')
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    const [user, password] = decoded.split(':')

    console.log('user: ', user)
    console.log('password: ', password)

    return {
        isAuthorized: !!process.env[user] && (process.env[user] === password)
    }
}
