import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import setActualUser from '../../shared/user/setActualUser'
import loadUsers from '../../shared/user/loadUsers'

import Input from '../form/Input'
import Message from './Message'


export default function WindowAuthUser({ setShow, userName, setAuth }) {
    const navigate = useNavigate()
    const winRef = useRef(null)

    const [password, setPassword] = useState('')

    const [showWinInputNull, setShowWinInputNull] = useState(false)
    const [showWinIncorrectPassword, setShowWinIncorrectPassword] = useState(false)

    const [users, setUsers] = useState([])

    useEffect(() => {
        setUsers(loadUsers())
    }, [])

    const handleClose = () => {
        if (winRef.current) {
            winRef.current.classList.remove("animate-slide-in")
            winRef.current.classList.add("animate-slide-out")
        };

        const onAnimationEnd = () => {
            setShow(false)
        }

        winRef.current.addEventListener("animationend", onAnimationEnd)
    }

    const login = (e) => {
        e.preventDefault()

        if (!password) {
            setShowWinInputNull(true)
            return
        }

        const user = users.find(u => u.name === userName)

        if (!user) {
            setShowWinIncorrectPassword(true)
            return
        }

        if (user.password === password) {
            setActualUser(userName)
            setAuth(true)
            navigate('/')
        } else {
            setShowWinIncorrectPassword(true)
        }
    }


    return (
        <div
            className="animate-slide-in fixed top-0 left-0 h-screen w-screen
                z-9 bg-gray-200 p-8 flex md:justify-center gap-12"
            ref={winRef}
        >
            <div className="flex flex-col w-full gap-12 md:w-200">
                <button
                    className="w-min bg-white p-3 rounded-full font-bold
                        text-2xl px-4 shadow hover:bg-gray-100 cursor-pointer
                        transition duration-300"
                    onClick={handleClose}
                >
                    <i className="bi bi-chevron-left"></i>
                </button>
                <h1
                    className="font-black text-3xl"
                >
                    Autenticação - {userName}
                </h1>
                <form className="border-l-4 border-l-brand-300 p-6 flex
                    flex-col gap-8">
                    <Input
                        id='password'
                        label='Senha:'
                        type='password'
                        handleChange={setPassword}
                        placeholder='Insira sua senha'
                    />
                    <button
                        className="self-end bg-brand-300 p-4 w-40
                            text-white font-bold text-xl rounded cursor-pointer
                            transition duration-300 hover:bg-brand-400 transform
                            hover:-translate-y-1.5 hover:shadow-lg"
                        onClick={(e) => login(e)}
                    >
                        Entrar
                    </button>
                </form>
            </div>
            {showWinInputNull && (
                <Message
                    message='Por favor, insira sua senha!'
                    setShow={setShowWinInputNull}
                    type='error'
                />
            )}
            {showWinIncorrectPassword && (
                <Message
                    message='Senha incorreta! Por favor, tente outra.'
                    setShow={setShowWinIncorrectPassword}
                    type='error'
                />
            )}
        </div>
    )
}
