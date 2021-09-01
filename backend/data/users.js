import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: true,
    },
    // {
    //     name: 'John Doe',
    //     email: 'john@example.com',
    //     password: bcrypt.hashSync('123456', 10),
    // },
    // {
    //     name: 'Jane Doe',
    //     email: 'JANE@example.com',
    //     password: bcrypt.hashSync('123456', 10),
    //     isStaff: true,
    // }
]

export default users