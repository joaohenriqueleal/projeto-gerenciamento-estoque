import { FaList } from "react-icons/fa"
import { useState } from "react"

import NavBar from './NavBar'

export default function Menu({ setAuth }) {
    const [showNavBar, setShowNavBar] = useState(false)

    return (
        <>
            <div
                className="text-4xl text-white p-3 hover:bg-brand-200
                    rounded cursor-pointer transition duration-300 hover:shadow-sm
                    hover:shadow-brand-500"
                onClick={() => setShowNavBar(true)}
            >
                <FaList />
            </div>

            {showNavBar && (
                <NavBar
                    setShow={setShowNavBar}
                    setAuth={setAuth}
                />
            )}
        </>
    )
}
