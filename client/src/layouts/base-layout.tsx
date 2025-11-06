import { Outlet } from "react-router-dom"

const BaseLayout = () => {
    return (
        <div className="flex flex-col max-h-screen overflow-hidden w-full h-full">

            <Outlet />
        </div>
    )
}

export default BaseLayout