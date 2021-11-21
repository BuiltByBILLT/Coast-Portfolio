import bcrypt from 'bcryptjs'

const users = [
    {
        firstName: 'Admin',
        lastName: 'Account',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: true,
        employeeID: 'TBSNZG5F3QJNJ'
    },
    {
        firstName: 'Employee Tom',
        lastName: 'Smith',
        email: 'tom@example.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: false,
        employeeID: 'A728RB8VMANMY'
    },
    {
        firstName: 'Employee Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: false,
        employeeID: '3G8S0E0WXACJW'
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