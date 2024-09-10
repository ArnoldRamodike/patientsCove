'use server'

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"
import { InputFile } from "node-appwrite/file"

export const createUser = async (user: CreateUserParams) => {

    try {
        const newUser = await users.create(
            ID.unique(),
             user.email,
              user.phone, 
              undefined,
               user.name
            );
            return parseStringify(newUser);

    } catch (error : any) {
        if (error && error?.code === 409) {
            const documents = await users.list([
                Query.equal('email', [user.email])
            ])
            return documents?.users[0]
        }

            console.error("USER", error);

    }
}

export const getUser = async (userId: string) => {
    try {
        const user  = await users.get(userId);

        return parseStringify(user);
    } catch (error) {
        console.log("GET_USER", error);
        
    }
}

export const getPatient = async (userId: string) => {
    try {
        const patients  = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            // [
            //     Query.equal("userId", [userId])
            // ]
        );
        // console.log("Patient data", patients.documents[0]);
        

        return parseStringify(patients.documents[0]);
    } catch (error) {
        console.log("GET_PATIENT", error);
        
    }
}

export const registerPatient = async ({identificationDocument, ...patient}: RegisterUserParams) => {
    try {
        let file;
        console.log("Gets here!!");

        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string
            );
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
        }

        console.log("File:" , file);
        

        const newPatient = await databases.createDocument(
            DATABASE_ID!, PATIENT_COLLECTION_ID!, ID.unique(),{
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
            }
        );
        console.log("Patient Data:", newPatient);

        return parseStringify(newPatient);
    } catch (error) {
        console.log("REGISTER_PATIENT", error);
    }
}