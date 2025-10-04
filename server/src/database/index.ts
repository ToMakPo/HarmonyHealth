// MongoDB connection and products collection setup
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI: string = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
	console.error('❌ MONGODB_URI environment variable is not defined')
	process.exit(1)
}

mongoose.connect(MONGODB_URI)
	.catch(err => console.error('❌ MongoDB connection error:', err));

const db = mongoose.connection
db.on('error', console.error.bind(console, '❌ MongoDB connection error:'))
db.once('open', () => { console.log('✔️  Connected to MongoDB') })

export default db
