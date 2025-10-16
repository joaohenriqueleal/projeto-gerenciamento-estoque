import ReleaseItem from '../components/items/ReleaseItem'
import Message from '../components/windows/Message'
import Header from "../components/layout/Header"
import Input from "../components/form/Input"

import loadActualUser from "../shared/user/loadActualUser"
import loadReleases from "../shared/relese/loadReleases"
import saveReleases from "../shared/relese/saveReleases"
import formatTimestamp from '../utils/formatTimestamp'

import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"


export default function History() {
    const [showMessagwDeleted, setShowMessagwDeleted] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [actualUser, setActualUser] = useState('')

    const [releases, setReleases] = useState([])
    const [searchedReleases, setSearchedReleases] = useState([])

    useEffect(() => {
        const user = loadActualUser()
        if (user) {
            setActualUser(user)
            setReleases(loadReleases(user))
            setSearchedReleases(loadReleases(user))
        }
    }, [])

    const deleteRelease = (release) => {
        const newReleasesList = releases.filter((r) => r.time !== release.time)
        const newSearchedReleasesList = searchedReleases.filter((sr) => sr.time !== release.time)

        setReleases(newReleasesList)
        setSearchedReleases(newSearchedReleasesList)
        saveReleases(actualUser, newReleasesList)
        setShowMessagwDeleted(true)
    }

    const search = () => {
        if (!searchValue) {
            setSearchedReleases(releases)
            return
        }

        const filteredReleases = releases.filter((r) => {
            const data = { ...r }
            data.time = formatTimestamp(data.time)
            const joined = Object.values(data).join(' ').toLowerCase()
            return joined.includes(searchValue)
        })

        setSearchedReleases(filteredReleases)
    }

    return (
        <div className='flex flex-col h-screen w-screen'>
            <Header title='Histórico movimentações' />
            <main
                className="p-4 flex flex-col gap-4 h-full max-w-200 lg:m-auto"
            >
                <section
                    className="flex gap-2 items-center justify-center"
                >
                    <Input
                        type='text'
                        width='w-80 md:w-150'
                        id='inputSearch'
                        label='Pesquisa:'
                        color='bg-gray-100'
                        handleChange={setSearchValue}
                        placeholder='Insira a pesquisa data/nome/valor etc.'
                    />
                    <button
                        className="flex gap-2 bg-brand-300 p-4 transform translate-y-3.5
                            rounded items-center justify-center text-white font-bold
                            hover:bg-brand-200 cursor-pointer transition duration-300"
                        onClick={search}
                    >
                        <FaSearch />
                        Pesquisar
                    </button>
                </section>
                <section
                    className='shadow-md p-4 bg-gray-100 h-full rounded-md
                        overflow-y-auto flex flex-col gap-4'
                >
                    {searchedReleases.length > 0 ? (
                        searchedReleases.map((r, i) => (
                            <ReleaseItem
                                deleteRelease={deleteRelease}
                                release={r}
                                key={i}
                            />
                        ))
                    ) : (
                        <p
                            className='text-gray-600 text-center'
                        >
                            Nenhuma movimentação encontrada.
                        </p>
                    )}
                </section>
            </main>
            {showMessagwDeleted && (
                <Message
                    message='Movimentação deletada com sucesso!'
                    setShow={setShowMessagwDeleted}
                />
            )}
        </div>
    )
}
