import { useEffect, useRef, useState } from "react"
import loadCategories from '../../shared/category/loadCategories'
import loadProducts from '../../shared/product/loadProducts'
import saveProducts from '../../shared/product/saveProducts'
import loadActualUser from '../../shared/user/loadActualUser'
import Message from "./Message"
import Input from "../form/Input"

export default function WindowEditProduct({ setShow, product }) {
    const [showMessageInvalidInputs, setShowMessageInvalidInputs] = useState(false)
    const [showMessageProductEdited, setShowMessageProductEdited] = useState(false)
    const [actualUser, setActualUser] = useState('')
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [productName, setProductName] = useState('')
    const [productValue, setProductValue] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const containerRef = useRef(null)

    const handleClose = () => {
        if (containerRef.current) {
            containerRef.current.classList.remove('animate-slide-in')
            containerRef.current.classList.add('animate-slide-out')
            const onAnimEnd = () => {
                setShow(false)
                containerRef.current.removeEventListener('animationend', onAnimEnd)
            }
            containerRef.current.addEventListener('animationend', onAnimEnd)
        }
    }

    useEffect(() => {
        setActualUser(loadActualUser())
    }, [])

    useEffect(() => {
        if (actualUser) {
            setCategories(loadCategories(actualUser))
            setProducts(loadProducts(actualUser))
        }
    }, [actualUser])

    useEffect(() => {
        if (product) {
            setProductName(product.name)
            setProductValue(product.value)
            setProductCategory(product.category)
        }
    }, [product])

    const editProduct = (e) => {
        e.preventDefault()
        if (!productName || !productValue || !productCategory) {
            setShowMessageInvalidInputs(true)
            return
        }
        const newProductsList = products.map((p) => {
            if (p.id === product.id) {
                return {
                    ...p,
                    name: productName,
                    value: parseFloat(productValue),
                    category: productCategory,
                }
            }
            return p
        })
        setProducts(newProductsList)
        saveProducts(actualUser, newProductsList)
        setShowMessageProductEdited(true)
    }

    return (
        <div
            className="animate-slide-in h-screen w-screen bg-gray-200
                z-9 fixed top-0 left-0 p-8 flex justify-center"
            ref={containerRef}
        >
            <div className="flex flex-col gap-8 w-full md:w-180">
                <button
                    className="w-min bg-white p-3 rounded-full font-bold
                        text-2xl px-4 shadow hover:bg-gray-100 cursor-pointer
                        transition duration-300"
                    onClick={handleClose}
                >
                    <i className="bi bi-chevron-left"></i>
                </button>
                <h1 className="font-black text-2xl">
                    Editar produto - {product.name}
                </h1>
                <form
                    className="w-full border-l-4 border-brand-300 p-4
                        md:w-200 flex flex-col"
                >
                    <Input
                        type="text"
                        id="inputName"
                        color="bg-gray-100"
                        label="Nome do produto:"
                        handleChange={setProductName}
                        placeholder="Insira o nome do produto"
                        value={productName}
                    />

                    <Input
                        type="number"
                        id="inputValue"
                        color="bg-gray-100"
                        label="Valor unitário (R$):"
                        handleChange={setProductValue}
                        placeholder="Ex: 29.90"
                        value={productValue}
                    />

                    <div className="flex flex-col gap-2 p-4">
                        <label htmlFor="selectCategory" className="pl-2 text-gray-700">
                            Categoria:
                        </label>
                        <select
                            id="selectCategory"
                            value={productCategory}
                            onChange={(e) => setProductCategory(e.target.value)}
                            className="bg-gray-100 p-4 rounded shadow-md"
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((c) => (
                                <option key={c.name} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="button"
                        className="p-4 mt-6 self-end bg-blue-700
                            rounded text-white font-bold text-xl shadow-md
                            w-40 hover:bg-blue-500 cursor-pointer transition
                            duration-300 transform hover:-translate-y-1.5
                            hover:shadow-xl mr-4"
                        onClick={editProduct}
                    >
                        Editar
                    </button>
                </form>
            </div>

            {showMessageInvalidInputs && (
                <Message
                    message="Por favor, preencha todos os campos corretamente!"
                    setShow={setShowMessageInvalidInputs}
                    type="error"
                />
            )}

            {showMessageProductEdited && (
                <Message
                    message="Produto editado com sucesso!"
                    setShow={setShowMessageProductEdited}
                />
            )}
        </div>
    )
}
