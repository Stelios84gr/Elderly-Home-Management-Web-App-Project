export interface Visitor {
    _id?: string,
    username: string,
    firstName: string,
    lastName: string,
    phoneNumber: number,
    address: Address,
    relationship: string,
    isFamily: boolean,
    patientToVisit: string
};

export interface Address {
    street: string,
    number: string
};
