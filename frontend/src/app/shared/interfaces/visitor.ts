export interface Visitor {
    username: string,
    firstName: string,
    lastName: string,
    phoneNumber: number,
    address: Address,
    relationship: string,
    isFamily: boolean
};

export interface Address {
    street: string,
    number: string
};
