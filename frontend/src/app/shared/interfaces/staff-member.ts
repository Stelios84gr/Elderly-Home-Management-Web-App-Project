export interface StaffMember {
    _id?: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
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

export interface LoggedInStaffMember {
    username: string,
    roles: string[];
};