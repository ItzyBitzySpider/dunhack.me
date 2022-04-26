import { getSession } from "next-auth/react"
import { userEnabled } from "./userFunctions";

import prisma from "./databaseFunctions";

/**
 * Get instance status of a user
 * @param userId 
 * @returns 
 */
export async function getInstanceStatus(userId: string): Promise<any> {
    try {
        let enabled = await userEnabled(userId);
        if (enabled === false || enabled === null) {
            throw new Error("UserId not valid");
        }
        let response = await fetch(`${process.env.RUNNER_SITE}/getUserStatus?userid=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let json = await response.json();
        return json;
	} catch (err) {
        console.log(err);
	}
}

/**
 * Get all Instance Status (Admin Console)
 * @returns 
 */
export async function getAllInstanceStatus(): Promise<any> {
    try {
        let response = await fetch(`${process.env.RUNNER_SITE}/getStatus`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.API_AUTH
            }
        });
        let json = await response.json();
        return json;
	} catch (err) {
        console.log(err);
	}
}

/**
 * Remove Instance for specific User (Admin Console)
 * @param userId 
 * @returns 
 */
export async function removeInstance(userId: string): Promise<any> {
        try {
        let enabled = await userEnabled(userId);
        if (enabled === false || enabled === null) {
            throw new Error("UserId not valid");
        }
        let response = await fetch(`${process.env.RUNNER_SITE}/removeInstance?userid=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let json = await response.json();
        return json;
	} catch (err) {
        console.log(err);
	}
}