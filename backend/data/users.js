import bcrypt from 'bcryptjs'

const users = [
    {
        firstName: 'Admin',
        lastName: 'Account',
        email: 'brandon@builtbybillt.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: true,
        employeeID: 'TBSNZG5F3QJNJ'
    },
    {
        firstName: 'Employee',
        lastName: 'Smith',
        email: 'smith@example.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: false,
        employeeID: 'A728RB8VMANMY'
    },
    {
        firstName: 'Angel',
        lastName: 'Sermeno',
        email: 'angel.sermeno4239@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: false,
        employeeID: '0K0XF2NJA9NN4'
    },
    {
        firstName: 'David',
        lastName: 'Avelar',
        email: 'davidavelar86@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: false,
        employeeID: '69GGRN9QRWACE'
    },
    {
        firstName: 'Jess',
        lastName: 'Eisenhart',
        email: 'jess@sprinklesmedia.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: false,
        employeeID: 'SXYY94AGGFJZ4'
    },
    {
        firstName: 'Tom',
        lastName: 'Mcweeney',
        email: 'tjmcweeney@yahoo.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: false,
        employeeID: 'SAJFPMNEPVFSW'
    },
    {
        firstName: 'Nick',
        lastName: 'Manning',
        email: 'nickmanningg@yahoo.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: false,
        employeeID: 'VVJG8VZJHBA0P'
    },
    {
        firstName: 'Mya',
        lastName: 'Serrano',
        email: 'myaserrano1313@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: false,
        employeeID: 'YFN6ZTFWXENAA'
    },
    {
        firstName: 'Ryan',
        lastName: 'Francis',
        email: 'ryan@coastairbrush.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: false,
        employeeID: 'DMJSKDAVF70J2'
    },
    {
        firstName: 'David',
        lastName: 'Byers',
        email: 'dbyers@coastairbrush.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: false,
        employeeID: 'BADYRQRAKSV8M'
    },
    {
        firstName: 'David',
        lastName: 'Coast',
        email: 'david@coastairbrush.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: false,
        employeeID: 'Z7GVB5TG4MFHW'
    },
    {
        firstName: 'SiG',
        lastName: 'Coast',
        email: 'sig@coastairbrush.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: false,
        employeeID: 'XHMWHZY6ERQ7J'
    },
    {
        firstName: 'Raina',
        lastName: 'Monnig',
        email: 'raina@coastairbrush.com',
        password: bcrypt.hashSync('123456', 10),
        isStaff: true,
        isAdmin: true,
        employeeID: 'GMD8Z6AKY86PG'
    },


]

export default users