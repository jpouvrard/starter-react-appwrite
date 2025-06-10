import { Outlet } from "react-router";

import { ToastContextProvider } from "@/lib/context/toast";
import { UserProvider } from "@/lib/context/user";

export default function App() {
    return (
        <ToastContextProvider>
            <UserProvider>
                <Outlet />
            </UserProvider>
        </ToastContextProvider>
    );
}
