// Simple in-memory user storage (replace with database in production)
export let users = [
  {
    id: '1',
    email: 'admin@regenexx.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8mG', // password: admin123
    name: 'Admin User',
  },
]

export const addUser = (user: any) => {
  users.push(user)
}

export const findUserByEmail = (email: string) => {
  return users.find(user => user.email === email)
}
