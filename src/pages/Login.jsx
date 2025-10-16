import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import setRedirect from '../shared/redirect/setRedirect'
import UserItem from "../components/items/UserItem"
import loadUsers from "../shared/user/loadUsers"


export default function Login({ setAuth }) {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    
    useEffect(() => {
        setUsers(loadUsers())
    }, [])

    const redirectToNewAccountPage = () => {
        setRedirect(false)
        navigate('/register')
    }

    return (
        <main
            className="flex items-center flex-col py-16 gap-16"
        >
            <h1 className="font-black text-4xl animate-shrink-md">LOGIN</h1>
            <section
                className="border-l-4 border-t-4 border-brand-400 p-4
                    flex flex-col animate-shrink-md md:w-190 min-w-100"
            >
                <button
                    className="bg-brand-300 p-3 rounded-md shadow cursor-pointer
                        mb-4 text-white font-bold text-xl hover:bg-brand-400 transition
                        duration-300 transform hover:-translate-y-1"
                    onClick={redirectToNewAccountPage}
                >
                    Nova conta+
                </button>
                {users.length == 0 ? (
                    <p
                        className="text-center text-gray-400 p-6"
                    >
                        Você não tem nenhuma conta cadastrada.
                    </p>
                ) : (
                    users.map((u, i) => (
                        <UserItem
                            setAuth={setAuth}
                            userName={u.name}
                            key={i}
                        />
                    ))
                )}
            </section>
        </main>
    )
}
