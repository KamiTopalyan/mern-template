import { Button, Nav, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import * as UsersApi from "../network/users_api";
import style from "../styles/App.module.css"
interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessful: () => void,
}

const NavBarLoggedInView = ({ user, onLogoutSuccessful }: NavBarLoggedInViewProps) => {

    async function logout() {
        try {
            await UsersApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
 /*
    async function download() {
        try {
            const status = await OrdersApi.download();
            if (status === 200) {
                window.open("/MERN Websites/idealab/Test/backend/src/CSV Exports/orders.csv");
                return false;
            } else {
                alert("Download failed");
            }
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
*/


    return (
        <>
            {/* <Button onClick={download}>Download</Button> */}
            <Navbar.Text className={`me-2 ${style.navbarText}`}>
                Signed in as: {user.username}
            </Navbar.Text>
            <Button onClick={logout}>Log out</Button>
        </>
    );
}

export default NavBarLoggedInView;