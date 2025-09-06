export interface Patient {
    _id?: string,
    username: string,
    firstName: string,
    lastName: string,
    AMKA: string,
    dateOfBirth: Date,
    phoneNumber: number,
    authorizationToLeave: boolean,
    roomData: RoomData,
    patientAilments: PatientAilment[],
    emergencyContactInfo: EmergencyContactInfo,
    visitors: Visitor[]
};

export interface RoomData {
     roomNumber: string,
     bedNumber: string
};

export interface PatientAilment {
    disease: string,
    severity: number
};

export interface EmergencyContactInfo {
    firstName: string,
    lastName: string,
    phoneNumber: number,
    address: Address,
    kinshipDegree: string
};

export interface Address {
    street: string,
    number: number
};

export interface Visitor {
    firstName: string,
    lastName: string,
    relationship: string
};