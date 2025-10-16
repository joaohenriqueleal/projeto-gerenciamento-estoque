import { useEffect, useRef, useState } from "react"

import loadCategories from '../../shared/category/loadCategories'
import saveCategories from '../../shared/category/saveCategories'
import loadActualUser from '../../shared/user/loadActualUser'
import loadProducts from '../../shared/product/loadProducts'
import saveProducts from '../../shared/product/saveProducts'
import loadReleases from '../../shared/relese/loadReleases'
import saveReleases from '../../shared/relese/saveReleases'


export default function WindowDeleteCategory({ setShow, categoryName, setShowMessageDelete }) {
    const [actualUser, setActualUser] = useState('')
    const [releases, setReleases] = useState([])
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])

    const windowRef = useRef(null)

    useEffect(() => {
        setActualUser(loadActualUser())
    }, [])

    useEffect(() => {
        if (actualUser) {
            setCategories(loadCategories(actualUser))
            setProducts(loadProducts(actualUser))
            setReleases(loadReleases(actualUser))
        }
    }, [actualUser])

    const handleClose = () => {
        if (windowRef.current) {
            windowRef.current.classList.remove('animate-slide-in')
            windowRef.current.classList.add('animate-slide-out')

            const onAnimEnd = () => {
                setShow(false)
                windowRef.current.removeEventListener('animationend', onAnimEnd)
            }

            windowRef.current.addEventListener('animationend', onAnimEnd)
        }
    }

    const deleteCategory = () => {
        const newCategoriesList = categories.filter(c => c.name !== categoryName)
        const newProductsList = products.filter(p => p.category !== categoryName)
        const newReleasesList = releases.filter(r => {
            const product = products.find(p => p.name === r.productName)
            return !product || product.category !== categoryName
        })

        setCategories(newCategoriesList)
        setProducts(newProductsList)
        setReleases(newReleasesList)

        saveCategories(actualUser, newCategoriesList)
        saveProducts(actualUser, newProductsList)
        saveReleases(actualUser, newReleasesList)

        setShowMessageDelete(true)
        handleClose()
    }

    return (
        <div
            className="animate-slide-in h-screen w-screen bg-gray-200
                z-9 fixed top-0 left-0 p-8 flex justify-center"
            ref={windowRef}
        >
            <div className="flex flex-col gap-16 w-full md:w-180">
                <button
                    className="w-min bg-white p-3 rounded-full font-bold
                        text-2xl px-4 shadow hover:bg-gray-100 cursor-pointer
                        transition duration-300"
                    onClick={handleClose}
                >
                    <i className="bi bi-chevron-left"></i>
                </button>
                <h1 className="font-black text-2xl text-center">
                    Você deseja real mente deletar a categoria '{categoryName}'?
                    Todos os produtos desta categoria tembém serão excluídos!
                </h1>
                <div className="flex items-center justify-center gap-12 w-full
                    bg-white p-6 rounded">
                    <button
                        className="bg-red-600 text-white w-30
                            flex gap-2 items-center justify-center
                            p-3 rounded font-bold shadow-md hover:bg-red-400
                            cursor-pointer transition duration-300 transform
                            hover:-translate-y-1.5"
                        onClick={handleClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className='bg-blue-700 text-white w-30
                            flex gap-2 items-center justify-center
                            p-3 rounded font-bold shadow-md hover:bg-blue-500
                            cursor-pointer transition duration-300 transform
                            hover:-translate-y-1.5'
                        onClick={deleteCategory}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    )
}
