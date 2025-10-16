import { useState, useEffect, useRef } from "react";

import setActualUser from '../../shared/user/setActualUser'
import loadUsers from '../../shared/user/loadUsers'
import saveUsers from '../../shared/user/saveUsers'

import Input from '../form/Input'
import Message from './Message'


export default function RegisterForm({ setAuth, setShow }) {
    const [showMessageHasUser, setShowMessageHasUser] = useState(false)
    const [showMessageInvalidInput, setShowMessageInvalidInput] = useState(false)

    const formRef = useRef(null)

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const [users, setUsers] = useState([])

    useEffect(() => {
        setUsers(loadUsers())
    }, [])

    const handleClose = () => {
        if (formRef.current) {
            formRef.current.classList.remove("animate-slide-in")
            formRef.current.classList.add("animate-slide-out")
        };

        const onAnimationEnd = () => {
            setShow(false)
        }

        formRef.current.addEventListener("animationend", onAnimationEnd)
    }

    const handleCreateAccount = (e) => {
        e.preventDefault()

        if (!userName || !password) {
            setShowMessageInvalidInput(true)
            return
        }

        if (users.some(u => u.name === userName)) {
            setShowMessageHasUser(true)
            return
        }

        const newUsersList = [...users, { name: userName, password }]

        saveUsers(newUsersList)
        setActualUser(userName)
        setAuth(true)
    }

    return (
        <div
            className="fixed top-0 left-0 h-screen w-screen bg-gray-200
                z-9 animate-slide-in flex flex-col items-center
                gap-8 p-8 lg:py-12"
            ref={formRef}
        >
            <div className="flex flex-col gap-8 lg:w-200 min-w-100">
                <button
                    className="w-min bg-white p-3 rounded-full font-bold
                        text-2xl px-4 shadow hover:bg-gray-100 cursor-pointer
                        transition duration-300"
                    onClick={handleClose}
                >
                    <i className="bi bi-chevron-left"></i>
                </button>
                <h1 className="font-black text-3xl">Criar conta</h1>
                <form className="border-l-4 border-brand-200 flex flex-col">
                    <Input
                        type='text'
                        id='userName'
                        handleChange={setUserName}
                        label='Nome do seu negócio:'
                        placeholder='Insira o nome do seu negócio'
                    />
                    <Input
                        id='password'
                        type='password'
                        label='Senha de usuário:'
                        handleChange={setPassword}
                        placeholder='Insira a senha de usuário'
                    />
                    <button
                        className="self-end m-4 p-4 w-40 bg-brand-500 rounded-md
                            text-white font-bold text-xl hover:bg-brand-400
                            transition duration-300 cursor-pointer transform
                            hover:-translate-y-2"
                        onClick={(e) => handleCreateAccount(e)}
                        type="submit"
                    >
                        Criar
                    </button>
                </form>
            </div>
            {showMessageHasUser && (
                <Message
                    message='Usuário já existe! Por favor, tente outro nome.'
                    setShow={setShowMessageHasUser}
                    type='error'
                />
            )}
            {showMessageInvalidInput && (
                <Message
                    message='Por favor, preencha todos os campos.'
                    setShow={setShowMessageHasUser}
                    type='error'
                />
            )}
        </div>
    )
}
