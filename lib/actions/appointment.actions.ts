'use server'

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, APPOINTMENT_COLLECTION_ID, messaging } from "../appwrite.config"
import { formatDateTime, parseStringify } from "../utils"
import { InputFile } from "node-appwrite/file"
import { Appointment } from "@/types/appwrite.types"
import { revalidatePath } from "next/cache"


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

export const getRecentAppointmentList = async () => {
    try {
        const appointments  = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc("$createdAt")]
        );
        
        const initialCount = {
            scheduleCount:0,
            pendingCount:0,
            cancelledCount: 0,
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === "scheduled") {
                acc.scheduleCount +=1;
            }
            else if (appointment.status === "pending") {
                acc.pendingCount +=1;
            }
            else if (appointment.status === "cancelled") {
                acc.cancelledCount +=1;
            }
            
            return acc
        }, initialCount);

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }
        

        return parseStringify(data);
    } catch (error) {
        console.log("GET_APPOINTMENTS", error);
        
    }
}


export const updatedAppointment = async ({appointmentId, userId, appointment, type} : UpdateAppointmentParams) => {
    try {
        const updatedAppointment  = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        );      
        
        if (!updatedAppointment) {
            throw new Error("Appointment not found!")
        }

        // SMS notification
        const smsMessage = 
        `Hi it's CarePulse.
           ${type === "scheduled" ? `Your appointment has been scheduleds for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}. `
          : `We regret to inform you that your appointment has been cancelled. for the following reason: ${appointment.cancellationReason}`
        } 
         `

         await sendSMSNotification(userId, smsMessage)

        revalidatePath("/admin")

        return parseStringify(updatedAppointment);
    } catch (error) {
        console.log("UPDATE_APPOINTMENT", error);
        
    }
}
export const sendSMSNotification = async (userId: string, content: string) => {
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        )

        return parseStringify(message);
    } catch (error) {
        console.log("SEND_SMS_NOTIFICATION", error);   
    }
}