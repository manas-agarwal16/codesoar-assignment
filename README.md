# 💼 CodeSoar Technologies – Backend Assignment

This repository contains the backend implementation for an assignment given by CodeSoar Technologies. It demonstrates user registration, login, spam reporting, and search functionalities using Node.js, Express, PostgreSQL, and Sequelize ORM. Implemented by Manas Agarwal.

## 🌐 Hosted URL

Base URL: https://codesoar-assignment.onrender.com

## ⚙️ Tech Stack

- **Backend**: Node.js, Express.js  
- **Database**: PostgreSQL  
- **ORM**: Sequelize  
- **Authentication**: JWT (accessToken and refreshToken stored in HTTP-only cookies)  
- **Hosting**: Render

## 📌 API Endpoints

Below are the endpoints, request formats, and example responses. For protected routes, include cookies in the request.

---

### 1. Register

- **Endpoint**: `POST /register`  
- **Access**: Public  
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "phoneNumber": "9876543210",
    "email": "john@example.com",  // optional
    "password": "yourPassword123"
  }
Example Response:

```json
{
  "status": 201,
  "data": [],
  "message": "User registered successfully.",
  "success": true
}
```

### 🔑 Login

- **Endpoint**: `POST /login`  
- **Access**: Public  

**Request Body**:
```json
{
  "phoneNumber": "9876543210",
  "password": "yourPassword123"
}
```

Example Response:

```json
{
  "status": 201,
  "data": {},
  "message": "user logged in successfully",
  "success": true
}
```

### 🚫 Report Spam

- **Endpoint**: `POST /report-spam`  
- **Access**: Protected (requires valid `accessToken` cookie)  

**Request Body**:
```json
{
  "phoneNumber": "9876543210"
}
```
Example Response:

```json
{
  "status": 200,
  "data": [],
  "message": "Spam reported successfully",
  "success": true
}
```

### 🔍 Search by Name

- **Endpoint**: `GET /search-by-name`  
- **Access**: Protected (requires valid `accessToken` cookie)  
- **Query Parameter**: ?name=<searchString>

**Example Request**: GET /search-by-name?name="a"

**Example Response**:

```json
{
  "status": 200,
  "data": [
    {
      "id": 114,
      "name": "Amanda MacGyver",
      "phoneNumber": "6777469187",
      "spamLikelihood": "0.00%"
    },
    {
      "id": 101,
      "name": "Amos O'Connell",
      "phoneNumber": "7207549965",
      "spamLikelihood": "0.00%"
    },
    {
      "id": 107,
      "name": "Santiago Towne",
      "phoneNumber": "8989044755",
      "spamLikelihood": "0.00%"
    }
  ],
  "message": "Users found successfully",
  "success": true
}
```

### ☎️ Search by Number

- **Endpoint**: `GET /search-by-number`  
- **Access**: Protected (requires valid accessToken cookie)  
- **Query Parameter**:  ?phoneNumber=<string>

**Example Request**: GET /search-by-number?phoneNumber=9742137422

**Example Response**:
```json
{
  "status": 200,
  "data": [
    {
      "name": "Phil Weissnat",
      "phoneNumber": "9742137422",
      "email": null,
      "spamLikelihood": "0.00%"
    }
  ],
  "message": "Users found successfully with the given phone number",
  "success": true
}
```

## 🚀 Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/manas-agarwal16/codesoar-assignment.git
cd codesoar-assignment
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a .env file in the root directory with the following variables:

```bash
PORT=
DATABASE_URL=''
ACCESSTOKEN_PRIVATE_KEY=''
REFRESHTOKEN_PRIVATE_KEY=''
CORS_ORIGIN=''
```

### 4. Start the server
```bash
npm start
```

📞 Contact
Email : manas.agarwal1604@gmail.com
phone : 8279653442
