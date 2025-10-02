/*
  # Initial Schema for College Attendance System

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique identifier for each user
      - `email` (text, unique) - User's email address
      - `full_name` (text) - User's full name
      - `role` (text) - User's role: 'principal', 'hod', or 'advisor'
      - `department` (text, nullable) - Department for HOD and advisors
      - `created_at` (timestamptz) - Record creation timestamp

    - `students`
      - `id` (uuid, primary key) - Unique identifier for each student
      - `roll_number` (text, unique) - Student's roll number
      - `name` (text) - Student's name
      - `department` (text) - Student's department
      - `year` (integer) - Current academic year
      - `advisor_id` (uuid, foreign key) - Reference to advisor user
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `attendance_records`
      - `id` (uuid, primary key) - Unique identifier for each attendance record
      - `student_id` (uuid, foreign key) - Reference to student
      - `date` (date) - Date of attendance
      - `status` (text) - Attendance status: 'present', 'absent', or 'late'
      - `marked_by` (uuid, foreign key) - Reference to user who marked attendance
      - `remarks` (text, nullable) - Optional remarks
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on their roles
    - Advisors can only manage their own students
    - HODs can view all students in their department
    - Principal can view all records

  3. Indexes
    - Add indexes for frequently queried columns
    - Composite index on student_id and date for attendance records
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('principal', 'hod', 'advisor')),
  department text,
  created_at timestamptz DEFAULT now()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_number text UNIQUE NOT NULL,
  name text NOT NULL,
  department text NOT NULL,
  year integer NOT NULL CHECK (year >= 1 AND year <= 4),
  advisor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  marked_by uuid REFERENCES users(id) ON DELETE SET NULL NOT NULL,
  remarks text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_students_advisor ON students(advisor_id);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance_records(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for students table
CREATE POLICY "Advisors can view their own students"
  ON students FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (
        users.role = 'principal'
        OR (users.role = 'hod' AND users.department = students.department)
        OR (users.role = 'advisor' AND users.id = students.advisor_id)
      )
    )
  );

CREATE POLICY "Advisors can insert students to their class"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'advisor'
      AND users.id = advisor_id
    )
  );

CREATE POLICY "Advisors can update their own students"
  ON students FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'advisor'
      AND users.id = students.advisor_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'advisor'
      AND users.id = students.advisor_id
    )
  );

CREATE POLICY "Advisors can delete their own students"
  ON students FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'advisor'
      AND users.id = students.advisor_id
    )
  );

-- RLS Policies for attendance_records table
CREATE POLICY "Users can view attendance based on role"
  ON attendance_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      LEFT JOIN students s ON s.id = attendance_records.student_id
      WHERE u.id = auth.uid()
      AND (
        u.role = 'principal'
        OR (u.role = 'hod' AND u.department = s.department)
        OR (u.role = 'advisor' AND u.id = s.advisor_id)
      )
    )
  );

CREATE POLICY "Advisors can mark attendance for their students"
  ON attendance_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      JOIN students s ON s.id = attendance_records.student_id
      WHERE u.id = auth.uid()
      AND u.role = 'advisor'
      AND u.id = s.advisor_id
      AND attendance_records.marked_by = auth.uid()
    )
  );

CREATE POLICY "Advisors can update attendance for their students"
  ON attendance_records FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN students s ON s.id = attendance_records.student_id
      WHERE u.id = auth.uid()
      AND u.role = 'advisor'
      AND u.id = s.advisor_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      JOIN students s ON s.id = attendance_records.student_id
      WHERE u.id = auth.uid()
      AND u.role = 'advisor'
      AND u.id = s.advisor_id
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_attendance_updated_at ON attendance_records;
CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
