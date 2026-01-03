curl -X POST http://localhost:5000/api/employees/register \
-H "Content-Type: application/json" \
-d '{
  "email": "accreus@example.com",
  "password": "SecurePass123",
  "first_name": "Accreus",
  "last_name": "Accreus",
  "position": "Unemployeed Engineer",
  "department": "Engineering",
  "salary": 60000
}'
