import { getSession } from "next-auth/react"
import { userEnabled } from "./userFunctions";

import prisma from "./databaseFunctions";

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
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

