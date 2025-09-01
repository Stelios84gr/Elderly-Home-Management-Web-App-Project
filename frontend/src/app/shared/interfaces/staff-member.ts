export interface StaffMember {
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    TIN: string,
    phoneNumber: number,
    address: Address,
    occupation: string,
    roles: string[],
    startDate: Date,
    monthlySalary: number
};

export interface Address {
    street: string,
    number: string
};