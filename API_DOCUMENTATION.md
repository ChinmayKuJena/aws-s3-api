# AWS S3 Manager - API Documentation

A comprehensive AWS S3 management application built with NestJS featuring both REST API endpoints and a beautiful web UI.

## 🚀 Features

- ✅ List all S3 buckets
- ✅ List objects in a bucket with prefix support
- ✅ Upload files to S3 with folder organization
- ✅ Delete objects from S3
- ✅ Generate signed URLs for secure object access
- ✅ Beautiful web UI for all operations
- ✅ CORS enabled for cross-origin requests

## 📦 Installation

```bash
npm install
```

## 🏃 Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

The application will be available at:

- **UI**: http://localhost:3000
- **API**: http://localhost:3000/api/v1/s3

## 🎨 Web UI

Access the web interface at http://localhost:3000 to interact with S3 operations through a beautiful, user-friendly interface:

- **Home** (`/`) - Dashboard with all available operations
- **List Buckets** (`/buckets`) - View all S3 buckets
- **List Objects** (`/objects`) - Browse objects in a bucket
- **Upload File** (`/upload`) - Upload files with optional folder organization
- **Delete Object** (`/delete`) - Remove objects from buckets
- **Get Signed URL** (`/signed-url`) - Generate temporary access URLs

## 🔌 REST API Endpoints

### 1. List Buckets

**GET** `/api/v1/s3/buckets`

List all S3 buckets in your AWS account.

**Query Parameters:**

```
accessKey: string (required)
secretKey: string (required)
region: string (required)
```

**Example:**

```bash
curl "http://localhost:3000/api/v1/s3/buckets?accessKey=YOUR_KEY&secretKey=YOUR_SECRET&region=us-east-1"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "Name": "my-bucket",
      "CreationDate": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. List Objects

**GET** `/api/v1/s3/objects`

List objects in a specific bucket with optional prefix filtering.

**Query Parameters:**

```
accessKey: string (required)
secretKey: string (required)
region: string (required)
bucket: string (required)
prefix: string (optional)
```

**Example:**

```bash
curl "http://localhost:3000/api/v1/s3/objects?accessKey=YOUR_KEY&secretKey=YOUR_SECRET&region=us-east-1&bucket=my-bucket&prefix=folder/"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "Key": "folder/file.txt",
      "LastModified": "2024-01-01T00:00:00.000Z",
      "Size": 1024
    }
  ]
}
```

---

### 3. Upload File

**POST** `/api/v1/s3/upload`

Upload a file to S3 with optional folder organization.

**Content-Type:** `multipart/form-data`

**Body Parameters:**

```
accessKey: string (required)
secretKey: string (required)
region: string (required)
bucket: string (required)
key: string (optional - custom filename)
folder: string (optional - folder path)
file: file (required - the file to upload)
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/v1/s3/upload \
  -F "accessKey=YOUR_KEY" \
  -F "secretKey=YOUR_SECRET" \
  -F "region=us-east-1" \
  -F "bucket=my-bucket" \
  -F "folder=uploads" \
  -F "file=@/path/to/file.txt"
```

**Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "success": true
  }
}
```

---

### 4. Delete Object

**DELETE** `/api/v1/s3/object`

Delete an object from S3.

**Content-Type:** `application/json`

**Body Parameters:**

```json
{
  "accessKey": "string (required)",
  "secretKey": "string (required)",
  "region": "string (required)",
  "bucket": "string (required)",
  "key": "string (required)"
}
```

**Example:**

```bash
curl -X DELETE http://localhost:3000/api/v1/s3/object \
  -H "Content-Type: application/json" \
  -d '{
    "accessKey": "YOUR_KEY",
    "secretKey": "YOUR_SECRET",
    "region": "us-east-1",
    "bucket": "my-bucket",
    "key": "folder/file.txt"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Object deleted successfully",
  "data": {
    "success": true
  }
}
```

---

### 5. Generate Signed URL

**POST** `/api/v1/s3/signed-url`

Generate a temporary signed URL for secure object access (valid for 1 hour).

**Content-Type:** `application/json`

**Body Parameters:**

```json
{
  "accessKey": "string (required)",
  "secretKey": "string (required)",
  "region": "string (required)",
  "bucket": "string (required)",
  "key": "string (required)"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/v1/s3/signed-url \
  -H "Content-Type: application/json" \
  -d '{
    "accessKey": "YOUR_KEY",
    "secretKey": "YOUR_SECRET",
    "region": "us-east-1",
    "bucket": "my-bucket",
    "key": "folder/file.txt"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://my-bucket.s3.amazonaws.com/folder/file.txt?X-Amz-Algorithm=..."
  }
}
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
PORT=3000
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
```

### CORS Configuration

CORS is enabled by default in `src/main.ts`. You can customize it for production:

```typescript
app.enableCors({
  origin: 'https://your-frontend-domain.com', // Replace '*' with specific origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Accept, Authorization',
  credentials: true,
});
```

## 🛠️ Technology Stack

- **NestJS** - Progressive Node.js framework
- **AWS SDK v3** - AWS S3 client
- **Handlebars** - Template engine for UI
- **Multer** - File upload middleware
- **TypeScript** - Type-safe development

## 📁 Project Structure

```
aws-s3-api/
├── src/
│   ├── api/
│   │   └── v1/
│   │       ├── dto/
│   │       │   └── credentials.dto.ts
│   │       ├── api-v1.controller.ts
│   │       ├── api-v1.service.ts
│   │       └── api-v1.module.ts
│   ├── aws-s3/
│   │   ├── helpers/
│   │   │   └── s3-client.factory.ts
│   │   ├── services/
│   │   │   └── aws-s3.service.ts
│   │   ├── aws-s3.modles.ts
│   │   └── aws-s3.module.ts
│   ├── ui/
│   │   ├── ui.controller.ts
│   │   └── ui.module.ts
│   ├── app.module.ts
│   └── main.ts
├── views/
│   ├── index.hbs
│   ├── buckets.hbs
│   ├── objects.hbs
│   ├── upload.hbs
│   ├── delete.hbs
│   └── signed-url.hbs
└── public/
```

## 🔒 Security Notes

⚠️ **Important**: Never commit AWS credentials to version control!

- Use environment variables for credentials
- In production, use IAM roles instead of access keys when possible
- Implement proper authentication and authorization
- Validate and sanitize all inputs
- Use HTTPS in production
- Restrict CORS origins to trusted domains

## 🐛 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## 📝 License

This project is licensed under the UNLICENSED license.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Made with ❤️ using NestJS
