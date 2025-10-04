# HarmonyHealth Server

Backend server for the HarmonyHealth application built with Node.js and TypeScript.

## Environment Variables

Create a `.env` file in the server root directory with the following variables:

### Environment Variables

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `PORT` | Port number for the server | `5500` | ✅ |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/harmony` | ✅ |
| `JWT_SECRET` | Secret key for JWT token signing | `your-super-secret-key` | ✅ |
| `JWT_EXPIRATION` | JWT token expiration time | `2h` | ✅ |
| `JWT_REMEMBER_ME` | JWT expiration for "remember me" | `30d` | ✅ |
| `CORS_ORIGINS` | JSON array of allowed CORS origins | `["http://localhost:3000"]` | ❌ |
| `APP_DEBUG` | Enable debug mode | `false` | ❌ |

### Environment Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the values in `.env`:**
   ```env
   PORT=5500
   CORS_ORIGINS=["http://localhost:3000", "https://your-frontend-domain.com"]
   
   MONGODB_URI=mongodb://localhost:27017/harmony
   
   # JWT Configuration
   JWT_EXPIRATION=2h
   JWT_REMEMBER_ME=30d
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Development
   APP_DEBUG=false
   ```

### Environment Variable Details

#### `PORT`
- **Type:** Number
- **Default:** 5500
- **Description:** The port on which the server will listen for incoming requests.

#### `CORS_ORIGINS`
- **Type:** JSON Array of strings
- **Description:** Array of allowed origins for CORS requests. Include your frontend URLs here.
- **Example:** `["http://localhost:3000", "https://yourdomain.com"]`

#### `MONGODB_URI`
- **Type:** String
- **Description:** MongoDB connection string. Can be local or cloud (MongoDB Atlas).
- **Local Example:** `mongodb://localhost:27017/harmony`
- **Atlas Example:** `mongodb+srv://username:password@cluster.mongodb.net/harmony`

#### `JWT_SECRET`
- **Type:** String
- **Description:** Secret key used to sign and verify JWT tokens. **MUST BE CHANGED IN PRODUCTION!**
- **Security:** Use a long, random string. Consider using `openssl rand -hex 32` to generate one.

#### `JWT_EXPIRATION`
- **Type:** String (time format)
- **Description:** How long JWT tokens are valid for regular login.
- **Format:** Uses [ms](https://github.com/vercel/ms) format (e.g., `2h`, `30m`, `7d`)

#### `JWT_REMEMBER_ME`
- **Type:** String (time format)  
- **Description:** How long JWT tokens are valid when "remember me" is checked.
- **Format:** Uses [ms](https://github.com/vercel/ms) format (e.g., `30d`, `90d`)

#### `APP_DEBUG`
- **Type:** Boolean
- **Description:** Enable debug logging and development features.
- **Values:** `true` or `false`

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env` files to version control**
2. **Change `JWT_SECRET` in production** - use a cryptographically secure random string
3. **Use HTTPS in production** for all JWT token exchanges
4. **Restrict `CORS_ORIGINS`** to only your trusted domains
5. **Use environment-specific configurations** for different deployment stages

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Start production server:**
   ```bash
   npm start
   ```

## Development

The server includes:
- TypeScript support
- Hot reloading in development
- MongoDB integration
- JWT authentication
- CORS configuration
- Environment-based configuration

## Database

Make sure MongoDB is running locally or provide a valid MongoDB Atlas connection string in `MONGODB_URI`.

### Local MongoDB Setup
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## API Endpoints

*API documentation will be added as endpoints are implemented*

## Contributing

1. Follow TypeScript best practices
2. Add environment variables to this README when adding new ones
3. Test your changes locally before committing
4. Update API documentation for new endpoints
