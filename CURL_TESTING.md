# API Testing Guide - Curl Examples

## Prerequisites
- Backend running on http://localhost:5000
- Supabase project configured

## Authentication

### 1. Sign Up (Create New User)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{\n    \"email\": \"test@example.com\",\n    \"password\": \"password123\",\n    \"first_name\": \"John\",\n    \"last_name\": \"Doe\"\n  }'\n```

Response:
```json
{\n  \"user_id\": \"uuid\",\n  \"email\": \"test@example.com\",\n  \"access_token\": \"jwt_token\"\n}\n```

### 2. Sign In
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H \"Content-Type: application/json\" \\\n  -d '{\"email\": \"test@example.com\", \"password\": \"password123\"}'\n```

**Save the `access_token` for next requests**

### 3. Get Current User
```bash
curl http://localhost:5000/api/auth/me?email=test@example.com \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```

### 4. Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```

---

## Employee Management

### 1. Get All Employees (Paginated)
```bash
curl http://localhost:5000/api/employees?page=1&limit=10 \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```

### 2. Get Single Employee
```bash
curl http://localhost:5000/api/employees/{employee_id} \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```

### 3. Add New Employee
```bash
curl -X POST http://localhost:5000/api/employees \\\n  -H \"Content-Type: application/json\" \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\" \\\n  -d '{\n    \"first_name\": \"Jane\",\n    \"last_name\": \"Smith\",\n    \"email\": \"jane@company.com\",\n    \"position\": \"Developer\",\n    \"department\": \"Engineering\",\n    \"salary\": 75000\n  }'\n```

### 4. Update Employee
```bash
curl -X PUT http://localhost:5000/api/employees/{employee_id} \\\n  -H \"Content-Type: application/json\" \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\" \\\n  -d '{\n    \"first_name\": \"Jane\",\n    \"last_name\": \"Smith\",\n    \"position\": \"Senior Developer\"\n  }'\n```

### 5. Delete (Deactivate) Employee
```bash
curl -X DELETE http://localhost:5000/api/employees/{employee_id} \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```

---

## Attendance Management

### 1. Check In
```bash
curl -X POST http://localhost:5000/api/attendance/check-in \\\n  -H \"Content-Type: application/json\" \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\" \\\n  -d '{\"employee_id\": \"{employee_id}\"}'\n```

### 2. Check Out
```bash
curl -X PUT http://localhost:5000/api/attendance/check-out/{attendance_id} \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```

### 3. Get Attendance History
```bash
curl http://localhost:5000/api/attendance/history/{employee_id} \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```

### 4. Get Daily Summary
```bash
curl http://localhost:5000/api/attendance/daily/2025-01-05 \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```

### 5. Get Attendance Report
```bash
curl \"http://localhost:5000/api/attendance/report?department=Engineering&limit=50\" \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```

---

## Leave Management

### 1. Request Leave
```bash
curl -X POST http://localhost:5000/api/leaves/request \\\n  -H \"Content-Type: application/json\" \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\" \\\n  -d '{\n    \"employee_id\": \"{employee_id}\",\n    \"leave_type\": \"CASUAL\",\n    \"start_date\": \"2025-01-20\",\n    \"end_date\": \"2025-01-22\",\n    \"reason\": \"Personal leave\"\n  }'\n```

### 2. Get My Leaves
```bash
curl http://localhost:5000/api/leaves/my-leaves/{employee_id} \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```

### 3. Get Pending Leaves (Admin)
```bash
curl http://localhost:5000/api/leaves/pending?limit=50 \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```

### 4. Get Leave Balance
```bash
curl http://localhost:5000/api/leaves/balance/{employee_id} \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```

### 5. Approve/Reject Leave
```bash
curl -X PUT http://localhost:5000/api/leaves/status/{leave_id} \\\n  -H \"Content-Type: application/json\" \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\" \\\n  -d '{\"status\": \"APPROVED\"}'\n```

### 6. Get Leave Report
```bash
curl \"http://localhost:5000/api/leaves/report?status=PENDING\" \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```

---

## Complete Testing Workflow

### Step 1: Sign Up
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/signup \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"email\": \"demo@test.com\",\n    \"password\": \"demo123456\",\n    \"first_name\": \"Demo\",\n    \"last_name\": \"User\"\n  }' | jq -r '.access_token')\n\necho \"Token: $TOKEN\"\n```

### Step 2: Get Current User
```bash
curl http://localhost:5000/api/auth/me?email=demo@test.com \\\n  -H \"Authorization: Bearer $TOKEN\" | jq\n```

### Step 3: View All Employees
```bash
curl http://localhost:5000/api/employees?page=1&limit=5 \\\n  -H \"Authorization: Bearer $TOKEN\" | jq\n```

### Step 4: Check In
```bash
EMPLOYEE_ID=\"your-employee-id\"\ncurl -X POST http://localhost:5000/api/attendance/check-in \\\n  -H \"Content-Type: application/json\" \\\n  -H \"Authorization: Bearer $TOKEN\" \\\n  -d \"{\\\"employee_id\\\": \\\"$EMPLOYEE_ID\\\"}\" | jq\n```

### Step 5: Check Out
```bash
ATTENDANCE_ID=\"from-checkin-response\"\ncurl -X PUT http://localhost:5000/api/attendance/check-out/$ATTENDANCE_ID \\\n  -H \"Authorization: Bearer $TOKEN\" | jq\n```

---

## Error Responses

### 400 Bad Request
```json
{\n  \"error\": \"Email and password are required\"\n}\n```

### 401 Unauthorized
```json
{\n  \"error\": \"Invalid credentials\"\n}\n```

### 409 Conflict
```json
{\n  \"error\": \"Employee with this email already exists\"\n}\n```

### 500 Server Error
```json
{\n  \"error\": \"Internal server error\",\n  \"message\": \"Detailed error message\"\n}\n```

---

## Tips

1. **Save tokens**: Use `TOKEN=$(curl ... | jq -r '.access_token')` to save tokens
2. **Pretty print**: Add `| jq` to any curl command for formatted JSON
3. **Test dates**: Use ISO format: `2025-01-05`
4. **Check headers**: Use `-v` flag: `curl -v ...`
5. **Debug**: Backend logs will show in terminal running `npm start`

