import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from "react"

import RegisterCategory from '../pages/RegisterCategory'
import RegisterProduct from '../pages/RegisterProduct'
import Releases from '../pages/Releases'
import GridView from '../pages/GridView'
import Register from '../pages/Register'
import History from '../pages/History'
import Login from '../pages/Login'
import Home from '../pages/Home'

import setRedirect from '../shared/redirect/setRedirect.js'


export default function App() {
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        setRedirect(true)
    }, [])

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    authenticated ? <Home setAuth={setAuthenticated} /> : <Navigate to="/login" />
                } />

                <Route path="/lancamentos" element={
                    authenticated ? <Releases setAuth={setAuthenticated} /> : <Navigate to="/login" />
                } />

                <Route path="/visualizar" element={
                    authenticated ? <GridView/> : <Navigate to="/login" />
                } />

                <Route path="/cadastro-produto" element={
                    authenticated ? <RegisterProduct /> : <Navigate to="/login" />
                } />

                <Route path="/cadastro-categoria" element={
                    authenticated ? <RegisterCategory /> : <Navigate to="/login" />
                } />

                <Route path="/login" element={
                    authenticated ? <Navigate to="/" /> : <Login setAuth={setAuthenticated} />
                } />

                <Route path="/historico" element={
                    authenticated ? <History /> : <Navigate to="/" />
                } />

                <Route path="/register" element={
                    authenticated ? <Navigate to="/" /> : <Register setAuth={setAuthenticated} />
                } />
                <Route path="*" element={<Navigate to={authenticated ? "/" : "/login"} />} />
            </Routes>
        </Router>
    )
}
