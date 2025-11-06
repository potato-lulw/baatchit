import React from 'react'

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-screen'>
            <main className='h-full'>
                {children}
            </main>
        </div>
    )
}

export default AppWrapper