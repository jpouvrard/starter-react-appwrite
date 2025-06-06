import { ToastContextProvider } from "./lib/context/toast";
import { UserProvider } from "./lib/context/user";
import { Outlet } from "react-router";

export default function App() {
    return (
        <ToastContextProvider>
            <UserProvider>
                <Outlet />
            </UserProvider>
        </ToastContextProvider>
    );
}
