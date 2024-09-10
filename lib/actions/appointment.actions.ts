'use server'

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, APPOINTMENT_COLLECTION_ID } from "../appwrite.config"
import { parseStringify } from "../utils"
import { InputFile } from "node-appwrite/file"


export const createAppointment = async ({ ...appointment}: CreateAppointmentParams) => {
    try {

        const newAppintment = await databases.createDocument(
            DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, ID.unique(),
            {
                ...appointment
            }
        );
        console.log("Appointment Data:", newAppintment);

        return parseStringify(newAppintment);
    } catch (error) {
        console.log("APPOINTMENT", error);
    }
}


export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment  = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        );        

        return parseStringify(appointment);
    } catch (error) {
        console.log("GET_PATIENT", error);
        
    }
}