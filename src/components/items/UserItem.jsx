import WindowAuthUser from '../windows/WindowAuthUser'
import { useState } from 'react'


export default function UserItem({ userName, setAuth }) {
    const [showWinAuthUser, setShowWinAuthUser] = useState(false)

    return (
        <>
            <div
                className="flex text-2xl p-3 bg-gray-50 hover:bg-gray-100
                    transition duration-300 cursor-pointer justify-between"
                onClick={() => setShowWinAuthUser(true)}
            >
                <i className="bi bi-person-fill text-3xl"></i>
                <p className="font-bold text-gray-700">{userName}</p>
            </div>
            {showWinAuthUser && (
                <WindowAuthUser
                    setShow={setShowWinAuthUser}
                    userName={userName}
                    setAuth={setAuth}
                />
            )}
        </>
    )
}
