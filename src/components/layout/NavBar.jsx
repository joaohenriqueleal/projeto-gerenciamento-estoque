import { FaExchangeAlt, FaSignOutAlt, FaHome, FaBox, FaTh, FaHistory } from 'react-icons/fa'
import { MdGridView } from 'react-icons/md'
import Logo from '../../../public/logo.png'

import { Link } from "react-router-dom"
import { useRef } from "react"

import setActualUser from '../../shared/user/setActualUser'


export default function NavBar({ setShow, setAuth }) {
    const navRef = useRef(null)

    const handleClose = () => {
        if (navRef.current) {
            navRef.current.classList.remove('animate-slide-in-left-midle')
            navRef.current.classList.add('animate-slide-out-left-midle')
        }

        const onAnimEnd = () => {
            setShow(false)
        }

        navRef.current.addEventListener("animationend", onAnimEnd)
    }

    const logOut = () => {
        setActualUser(null)
        setAuth(false)
    }

    return (
        <div
            className="overlay flex"
            onClick={handleClose}
        >
            <nav
                className="bg-white h-full animate-slide-in-left-midle p-2
                    flex flex-col overflow-hidden shadow-xl"
                onClick={(e) => e.stopPropagation()}
                ref={navRef}
            >
                <h2 className='font-black text-gray-700
                    text-2xl p-2 pb-3 flex items-center justify-center'>
                    <img
                        src={Logo}
                        alt="Logo StorEdge"
                        className='w-8 h-8'
                    />
                    StorEdge
                </h2>
                <Link
                    to='/'
                    className='nav-link'
                >
                    <FaHome />
                    Home
                </Link>
                <Link
                    to='/lancamentos'
                    className='nav-link'
                >
                    <FaExchangeAlt />
                    Lançamentos+
                </Link>
                <Link
                    to='/visualizar'
                    className='nav-link'
                >
                    <MdGridView />
                    Visualizar
                </Link>
                <Link
                    to='/cadastro-categoria'
                    className='nav-link'
                >
                    <FaTh/>
                    categorias+
                </Link>
                <Link
                    to='/cadastro-produto'
                    className='nav-link'
                >
                    <FaBox />
                    Produtos+
                </Link>
                <Link
                    to='/historico'
                    className='nav-link'
                >
                    <FaHistory />
                    Histórico
                </Link>
                <Link
                    className='nav-link text-red-500'
                    onClick={logOut}
                    to='/login'
                >
                    <FaSignOutAlt/>
                    Sair
                </Link>
            </nav>
        </div>
    )
}
