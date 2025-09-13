# Timetable Scheduler Backend

A complete Node.js backend API for managing school timetables using Express, MongoDB, and JWT authentication.

## Features

- 🔐 JWT-based authentication with role-based access control
- 🔒 Password hashing using bcrypt
- 📚 Complete CRUD operations for all entities
- ✅ Input validation using express-validator
- 🛡️ Security middleware (helmet, cors)
- 📊 Pagination support
- 🔍 Search and filtering capabilities

## Models

- **User**: Authentication and user management
- **Teacher**: Teacher information and availability
- **Class**: Class details and requirements
- **Room**: Room information and capacity
- **Period**: Time slots and scheduling
- **Timetable**: Generated timetables
- **TimetableSlot**: Individual time slot assignments

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (protected)

### Teachers
- `GET /api/v1/teachers` - Get all teachers
- `GET /api/v1/teachers/:id` - Get teacher by ID
- `GET /api/v1/teachers/subject/:subject` - Get teachers by subject
- `POST /api/v1/teachers` - Create teacher (admin only)
- `PUT /api/v1/teachers/:id` - Update teacher (admin only)
- `DELETE /api/v1/teachers/:id` - Delete teacher (admin only)

### Classes
- `GET /api/v1/classes` - Get all classes
- `GET /api/v1/classes/:id` - Get class by ID
- `GET /api/v1/classes/year/:year` - Get classes by year
- `POST /api/v1/classes` - Create class (admin only)
- `PUT /api/v1/classes/:id` - Update class (admin only)
- `DELETE /api/v1/classes/:id` - Delete class (admin only)

### Rooms
- `GET /api/v1/rooms` - Get all rooms
- `GET /api/v1/rooms/:id` - Get room by ID
- `GET /api/v1/rooms/capacity/search` - Get rooms by capacity
- `POST /api/v1/rooms` - Create room (admin only)
- `PUT /api/v1/rooms/:id` - Update room (admin only)
- `DELETE /api/v1/rooms/:id` - Delete room (admin only)

### Periods
- `GET /api/v1/periods` - Get all periods
- `GET /api/v1/periods/grouped` - Get periods grouped by day
- `GET /api/v1/periods/:id` - Get period by ID
- `GET /api/v1/periods/day/:day_index` - Get periods by day
- `POST /api/v1/periods` - Create period (admin only)
- `PUT /api/v1/periods/:id` - Update period (admin only)
- `DELETE /api/v1/periods/:id` - Delete period (admin only)

### Timetables
- `GET /api/v1/timetables` - Get all timetables
- `GET /api/v1/timetables/:id` - Get timetable by ID
- `POST /api/v1/timetables` - Create timetable (admin/teacher)
- `PUT /api/v1/timetables/:id` - Update timetable (admin/teacher)
- `DELETE /api/v1/timetables/:id` - Delete timetable (admin only)
- `PATCH /api/v1/timetables/:id/publish` - Publish timetable (admin/teacher)
- `PATCH /api/v1/timetables/:id/archive` - Archive timetable (admin/teacher)

### Timetable Slots
- `GET /api/v1/timetable-slots` - Get all timetable slots
- `GET /api/v1/timetable-slots/timetable/:timetable_id` - Get slots by timetable
- `GET /api/v1/timetable-slots/class/:class_id` - Get slots by class
- `GET /api/v1/timetable-slots/teacher/:teacher_id` - Get slots by teacher
- `GET /api/v1/timetable-slots/:id` - Get slot by ID
- `POST /api/v1/timetable-slots` - Create slot (admin/teacher)
- `PUT /api/v1/timetable-slots/:id` - Update slot (admin/teacher)
- `DELETE /api/v1/timetable-slots/:id` - Delete slot (admin/teacher)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd timetable-scheduler-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/timetable_scheduler

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## Usage

### Authentication

1. **Register a new user:**
   ```bash
   curl -X POST http://localhost:5000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@school.com",
       "password": "password123",
       "role": "admin"
     }'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@school.com",
       "password": "password123"
     }'
   ```

3. **Use the token in subsequent requests:**
   ```bash
   curl -X GET http://localhost:5000/api/v1/teachers \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

### API Documentation

Visit `http://localhost:5000/api/v1/docs` for complete API documentation.

## Project Structure

```
├── config/
│   ├── config.js          # Configuration settings
│   └── database.js        # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── teacherController.js
│   ├── classController.js
│   ├── roomController.js
│   ├── periodController.js
│   ├── timetableController.js
│   └── timetableSlotController.js
├── middlewares/
│   ├── auth.js           # JWT authentication middleware
│   └── validation.js     # Input validation middleware
├── models/
│   ├── User.js
│   ├── Teacher.js
│   ├── Class.js
│   ├── Room.js
│   ├── Period.js
│   ├── Timetable.js
│   └── TimetableSlot.js
├── routes/
│   ├── index.js          # Main router
│   ├── auth.js
│   ├── teachers.js
│   ├── classes.js
│   ├── rooms.js
│   ├── periods.js
│   ├── timetables.js
│   └── timetableSlots.js
├── server.js             # Application entry point
├── package.json
└── README.md
```

## User Roles

- **admin**: Full access to all operations
- **teacher**: Can manage timetables and slots
- **student**: Read-only access
- **canteen_staff**: Limited access

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Helmet security headers

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
