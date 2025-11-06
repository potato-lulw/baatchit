import SignIn from "@/pages/auth/SignIn"
import SignUp from "@/pages/auth/SignUp"
import Chat from "@/pages/chat"
import SingleChat from "@/pages/chat/chatId"


export const AUTH_ROUTES = {
    SIGN_UP: "/sign-up",
    SIGN_IN: "/",
}

export const PROTECTED_ROUTES = {
    CHAT: "/chat",
    SINGLE_CHAT: "/chat/:chatId",
}

export const authRoutePaths = [
    {
        path: AUTH_ROUTES.SIGN_UP,
        name: "Sign Up",
        element: <SignUp />
    },
    {
        path: AUTH_ROUTES.SIGN_IN,
        name: "Sign In",
        element: <SignIn />
    }
]

export const protectedRoutePaths = [
    {
        path: PROTECTED_ROUTES.CHAT,
        name: "Chat",
        element: <Chat />
    },
    {
        path: PROTECTED_ROUTES.SINGLE_CHAT,
        name: "Single Chat",
        element: <SingleChat />
    }
]   


export const isAuthRoute = (pathname: string) => {
    return authRoutePaths.find(route => route.path === pathname)
}