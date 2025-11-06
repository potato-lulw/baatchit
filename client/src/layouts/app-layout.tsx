import AppWrapper from "@/components/app-wrapper"
import { Outlet } from "react-router-dom"

const AppLayout = () => {
    return (
        <AppWrapper>

            <div className="flex flex-row w-full max-h-screen h-full">
                <Outlet />
            </div>
        </AppWrapper>
    )
}

export default AppLayout