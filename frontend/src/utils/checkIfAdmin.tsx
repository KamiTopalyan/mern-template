import { getLoggedInUser } from "../network/users_api"

export default async function checkIfAdmin(){
    const user = await getLoggedInUser()
    return user["isAdmin"]
}