'use server'

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, APPOINTMENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
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