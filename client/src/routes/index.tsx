import BaseLayout from '@/layouts/base-layout'
import { Routes, Route } from 'react-router-dom'
import { authRoutePaths, protectedRoutePaths } from './routes'
import RouteGuard from './route-guard'
import AppLayout from '@/layouts/app-layout'

const AppRoutes = () => {
    return (


        <Routes>
            <Route path="/" element={<RouteGuard requiredAuth={false} />} >
                <Route element={<BaseLayout />}>
                    {
                        authRoutePaths.map(route => (
                            <Route key={route.name} path={route.path} element={route.element} />
                        ))
                    }
                </Route>

            </Route>

            <Route path='/' element={<RouteGuard requiredAuth={true} />}>
                <Route element={<AppLayout />}>
                    {
                        protectedRoutePaths.map(route => (
                            <Route key={route.name} path={route.path} element={route.element} />
                        ))
                    }
                </Route>

            </Route>
        </Routes>

    )
}

export default AppRoutes