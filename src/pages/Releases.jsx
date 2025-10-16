import Message from "../components/windows/Message"
import Header from "../components/layout/Header"
import Input from "../components/form/Input"

import loadActualUser from "../shared/user/loadActualUser"
import loadProducts from "../shared/product/loadProducts"
import loadReleases from '../shared/relese/loadReleases'
import saveReleases from '../shared/relese/saveReleases'

import { FaBox } from "react-icons/fa"

import { useEffect, useState } from "react"


export default function Releases() {
    const [showMessageInvalidInputs, setShowMessageInvalidInputs] = useState(false)
    const [showMessageStockOver0, setShowMessageStockOver0] = useState(false)
    const [showMessageStockAltered, setShowMessageStockAltered] = useState(false)

    const [products, setProducts] = useState([])
    const [releases, setReleases] = useState([])

    const [selectedProduct, setSelectedProduct] = useState(null)
    const [qtdProduts, setQtdProduts] = useState(0)

    useEffect(() => {
        const user = loadActualUser()
        if (user) {
            setProducts(loadProducts(user))
            setReleases(loadReleases(user))
        }
    }, [])

    const getProductStock = (productName) => {
        let productStock = 0

        products.map((p) => {
            if (p.name == productName) {
                productStock = p.storage
            }
        })

        releases.map((r) => {
            if (r.productName == productName) {
                if (r.type == 'sub') productStock -= Number(r.qtd)
                else if (r.type == 'sum') productStock += Number(r.qtd)
            }
        })

        return productStock
    }

    const reduceStock = (e) => {
        e.preventDefault()

        if (!selectedProduct || !qtdProduts) {
            setShowMessageInvalidInputs(true)
            return
        }

        if (getProductStock(selectedProduct) - qtdProduts < 0 || qtdProduts < 0) {
            setShowMessageStockOver0(true)
            return
        }

        const newReleasesList = [...releases, {
            type: 'sub',
            qtd: qtdProduts,
            time: Date.now(),
            productName: selectedProduct
        }]

        setReleases(newReleasesList)
        saveReleases(loadActualUser(), newReleasesList)
        setShowMessageStockAltered(true)

        setSelectedProduct('')
        setQtdProduts(0)
    }

    const sumStock = (e) => {
        e.preventDefault()

        if (!selectedProduct || !qtdProduts) {
            setShowMessageInvalidInputs(true)
            return
        }

        const newReleasesList = [...releases, {
            type: 'sum',
            qtd: qtdProduts,
            time: Date.now(),
            productName: selectedProduct
        }]

        setReleases(newReleasesList)
        saveReleases(loadActualUser(), newReleasesList)
        setShowMessageStockAltered(true)

        setSelectedProduct('')
        setQtdProduts(0)
    }

    return (
        <>
            <Header title='Adicionar lançamento' />
            <main className="p-12 flex justify-center gap-12">
                <div className="flex flex-col gap-12 lg:w-200 w-full">
                    <h1 className="font-black text-2xl text-center">
                        Modificar estoque de um produto
                    </h1>
                    <form className="p-4 flex flex-col gap-4 border-l-4
                            border-brand-400"
                    >
                        <div className="flex flex-col gap-3 p-4">
                            <label
                                className="font-black text-gray-600 pl-2"
                                htmlFor="inputProduct"
                            >
                                Selecione o produto:
                            </label>
                            {products.length > 0 ? (
                                <>
                                    <input
                                        className="border-2 p-4 rounded bg-gray-100 border-gray-300"
                                        list="products-list"
                                        id="inputProduct"
                                        value={selectedProduct || ""}
                                        onChange={(e) => setSelectedProduct(e.target.value)}
                                        placeholder="Digite ou selecione o produto"
                                    />
                                    <datalist id="products-list">
                                        {products.map((p, i) => (
                                            <option value={p.name} key={i} />
                                        ))}
                                    </datalist>
                                </>
                            ) : (
                                <p
                                    className="p-4 text-gray-400 font-bold border-1 rounded shadow bg-gray-100"
                                >
                                    Nenhum produto encontrado.
                                </p>
                            )}
                        </div>
                        <Input
                            placeholder='Insira a qunatidade'
                            handleChange={setQtdProduts}
                            label='Quantidade:'
                            color='bg-gray-100'
                            value={qtdProduts}
                            id='inputQtd'
                            type='number'
                        />
                        <div className="p-4 flex items-center justify-end gap-2">
                            <button
                                className="flex gap-2 bg-red-600 p-3
                                    items-center justify-center text-white font-bold
                                    rounded shadow-lg cursor-pointer hover:bg-red-500
                                    transition duration-300"
                                onClick={(e) => reduceStock(e)}
                            >
                                <FaBox />
                                Diminuir-
                            </button>
                            <button
                                className="flex gap-2 bg-green-600 p-3
                                    items-center justify-center text-white font-bold
                                    rounded shadow-lg cursor-pointer hover:bg-green-500
                                    transition duration-300"
                                onClick={(e) => sumStock(e)}
                            >
                                <FaBox />
                                Aumentar+
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            {showMessageInvalidInputs && (
                <Message
                    message='Por favor, preencha todos os campos!'
                    setShow={setShowMessageInvalidInputs}
                    type='error'
                />
            )}
            {showMessageStockOver0 && (
                <Message
                    message='Estoque não pode ficar abaixo de zero!'
                    setShow={setShowMessageStockOver0}
                    type='error'
                />
            )}
            {showMessageStockAltered && (
                <Message
                    message='Estoque alterado com sucesso!'
                    setShow={setShowMessageStockAltered}
                />
            )}
        </>
    )
}
