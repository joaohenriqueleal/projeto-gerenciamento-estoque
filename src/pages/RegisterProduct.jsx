import Message from '../components/windows/Message'
import Header from '../components/layout/Header'
import Input from '../components/form/Input'

import { useEffect, useState } from 'react'

import loadActualUser from '../shared/user/loadActualUser'
import loadProducts from '../shared/product/loadProducts'
import saveProducts from '../shared/product/saveProducts'
import loadCategories from '../shared/category/loadCategories'


export default function RegisterProduct() {
    const [showMessageInvalidInputs, setShowMessageInvalidInputs] = useState(false)
    const [showMessageHasProduct, setShowMessageHasProduct] = useState(false)
    const [showMessageProductAdded, setShowMessageProductAdded] = useState(false)

    const [actualUser, setActualUser] = useState('')
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])

    const [selectedCategory, setSelectedCategory] = useState('')
    const [initalStorage, setInitialStorage] = useState('')
    const [productName, setProductName] = useState('')
    const [productId, setProductId] = useState(0)
    const [productValue, setProductValue] = useState('')

    useEffect(() => {
        const user = loadActualUser()
        setActualUser(user)
    }, [])

    useEffect(() => {
        if (actualUser) {
            const loadedProducts = loadProducts(actualUser)
            const cats = loadCategories(actualUser)

            setProducts(loadedProducts)
            setCategories(cats)

            if (cats.length > 0) setSelectedCategory(cats[0].name)
            setProductId(loadedProducts.length)
        }
    }, [actualUser])

    const addProduct = (e) => {
        e.preventDefault()

        if (
            !productName ||
            !selectedCategory ||
            initalStorage <= 0 ||
            productValue <= 0
        ) {
            setShowMessageInvalidInputs(true)
            return
        }

        const existingProduct = products.find(
            (p) => p.name === productName || p.id === productId
        )

        if (existingProduct) {
            setShowMessageHasProduct(true)
            return
        }

        const newProducts = [
            ...products,
            {
                name: productName,
                id: productId,
                category: selectedCategory,
                storage: parseFloat(initalStorage),
                value: parseFloat(productValue),
                time: Date.now()
            }
        ]

        setProducts(newProducts)
        saveProducts(actualUser, newProducts)

        setProductName('')
        setInitialStorage('')
        setProductValue('')
        setProductId(products.length + 1)
        setShowMessageProductAdded(true)
    }

    return (
        <>
            <Header title="Cadastro de produto" />
            <main className="flex flex-col gap-12 items-center p-12">
                <h1 className="font-black text-2xl">
                    Insira os dados do produto
                </h1>

                <form className="border-l-4 border-brand-300 p-4 w-full
                    flex flex-col md:w-200">
                    
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
                        type="text"
                        id="inputId"
                        value={productId}
                        color="bg-gray-100"
                        label="ID do produto:"
                        handleChange={setProductId}
                        placeholder="Insira o ID do produto"
                    />

                    <Input
                        type="number"
                        id="inputQtd"
                        color="bg-gray-100"
                        handleChange={setInitialStorage}
                        label="Estoque inicial do produto:"
                        placeholder="Insira o estoque inicial"
                        value={initalStorage}
                    />

                    <Input
                        type="number"
                        id="inputValue"
                        color="bg-gray-100"
                        handleChange={setProductValue}
                        label="Valor unitário do produto (R$):"
                        placeholder="Ex: 19.90"
                        value={productValue}
                    />

                    <div className="flex flex-col gap-3 p-4">
                        <label
                            className="pl-2 text-gray-600"
                            htmlFor="inputCategory"
                        >
                            Selecione a categoria do produto:
                        </label>
                        <select
                            id="inputCategory"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-gray-100 p-4 rounded shadow"
                        >
                            {categories.length > 0 ? (
                                categories.map((cat, i) => (
                                    <option key={i} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))
                            ) : (
                                <option value="">Nenhuma categoria disponível</option>
                            )}
                        </select>
                    </div>

                    <button
                        className='p-4 mt-6 mr-4 self-end bg-brand-300
                            rounded text-white font-bold text-xl shadow-md
                            w-40 hover:bg-brand-200 cursor-pointer transition
                            duration-300 transform hover:-translate-y-1.5
                            hover:shadow-xl'
                        onClick={(e) => addProduct(e)}
                    >
                        Adicionar
                    </button>
                </form>

                {showMessageInvalidInputs && (
                    <Message
                        message='Por favor, preencha todos os campos corretamente!'
                        setShow={setShowMessageInvalidInputs}
                        type='error'
                    />
                )}
                {showMessageHasProduct && (
                    <Message
                        message='Esse produto já existe!'
                        setShow={setShowMessageHasProduct}
                        type='error'
                    />
                )}
                {showMessageProductAdded && (
                    <Message
                        message='Produto adicionado com sucesso!'
                        setShow={setShowMessageProductAdded}
                        type='success'
                    />
                )}
            </main>
        </>
    )
}
