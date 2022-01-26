import process from 'process'

const url = process.env.NEXT_PUBLIC_SERVER_LOCAL === 'true' ? 'http://localhost:3000' : ( process.env.NODE_ENV === 'development' ?  process.env.NEXT_PUBLIC_SERVER_DEV : process.env.NEXT_PUBLIC_SERVER_PRODUCTION )

export default url