import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
}
export type Time = bigint;
export interface ApplicationInput {
    age: bigint;
    city: string;
    name: string;
    socialHandle: string;
    personalityAnswers: string;
}
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export interface GuestApplication {
    id: string;
    age: bigint;
    status: ApplicationStatus;
    submissionTimestamp: Time;
    city: string;
    name: string;
    socialHandle: string;
    personalityAnswers: string;
}
export enum ApplicationStatus {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    generateInviteCode(): Promise<string>;
    getAllApplications(): Promise<Array<GuestApplication>>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getApplicationById(id: string): Promise<GuestApplication>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitApplication(input: ApplicationInput): Promise<string>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
    updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void>;
}
