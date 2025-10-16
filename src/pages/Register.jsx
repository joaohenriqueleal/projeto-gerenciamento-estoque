import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"

import corporativeBuilding from '../assets/img/corporative-building.jpg'
import RegisterForm from '../components/windows/RegisterForm'

import getRedirect from '../shared/redirect/getRedirect'
import loadUsers from "../shared/user/loadUsers"


export default function Register({ setAuth }) {
    const [showRegisterForm, setShowRegisterForm] = useState(false)
    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    
    useEffect(() => {
        setUsers(loadUsers())
    }, [])

    useEffect(() => {
        if (users.length > 0 && getRedirect().redirect) {
            navigate('/login')
        }
    }, [users, navigate])

    return (
        <main className='h-screen w-screen overflow-hidden lg:flex'>
            <div
                style={{ backgroundImage: `url(${corporativeBuilding})` }}
                className='h-screen w-screen animate-shrink-md rounded-b-4xl shadow-xl
                    bg-cover bg-center lg:w-1/2 lg:rounded-none lg:h-screen
                    lg:scale-100'
            ></div>

            <div className='p-8 pt-16 flex flex-col gap-8
                lg:w-1/2 lg:h-screen lg:justify-center lg:items-center lg:text-center'
            >
                <h1 className='font-black text-4xl'>
                    Gerencie o estoque do seu negócio com um clique.
                </h1>
                <p className='max-w-64'>
                    Crie sua conta na StorEdge agora mesmo pra começar!
                </p>
                <button
                    className='p-5 bg-brand-500 rounded-4xl text-white
                        font-bold text-2xl hover:bg-brand-400 transition duration-300
                        cursor-pointer w-full md:w-100  md:self-center'
                    onClick={() => setShowRegisterForm(true)}
                >
                    Criar conta
                </button>
                <Link
                    className="text-brand-500 self-end underline cursor-pointer
                        hover:text-brand-200 md:self-center"
                    to='/login'
                >
                    Já tem uma conta? Login
                </Link>
            </div>

            {showRegisterForm && (
                <RegisterForm
                    setAuth={setAuth}
                    setShow={setShowRegisterForm}
                />
            )}
        </main>
    )
}
