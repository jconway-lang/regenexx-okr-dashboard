import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { users, addUser, findUserByEmail } from '../../../src/utils/users'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password: hashedPassword,
    }

    // Add to users array (in production, save to database)
    users.push(newUser)

    // Return success (don't return password)
    const { password: _, ...userWithoutPassword } = newUser
    res.status(201).json({ 
      message: 'User created successfully',
      user: userWithoutPassword 
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
