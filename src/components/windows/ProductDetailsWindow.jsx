import WindowDeleteProduct from './WindowDeleteProduct'
import WindowEditProduct from './WindowEditProduct'
import Message from './Message'

import formatTimestamp from '../../utils/formatTimestamp'
import formatPrice from '../../utils/formatPrice'

import { useRef, useState } from "react"


export default function ProductDetailsWindow({ setShow, product, getProductStock }) {
    const [showMessageProductDeleted, setShowMessageProductDeleted] = useState(false)
    const [showWindowDeleteProduct, setShowWindowDeleteProduct] = useState(false)
    const [showWindowEditProduct, setShowWindowEditProduct] = useState(false)
    
    const containerRef = useRef(null)

    const handleClose = () => {
        if (containerRef.current) {
            containerRef.current.classList.remove('animate-slide-in')
            containerRef.current.classList.add('animate-slide-out')
        }

        const onAnimEnd = () => {
            setShow(false)
        }

        containerRef.current.addEventListener('animationend', onAnimEnd)
    }

    return (
        <div
            className="animate-slide-in h-screen w-screen bg-gray-200
                z-9 fixed top-0 left-0 p-8 flex justify-center"
            ref={containerRef}
        >
            <div className='flex flex-col gap-8 md:w-200 w-full'>
                <button
                        className="w-min bg-white p-3 rounded-full font-bold
                            text-2xl px-4 shadow hover:bg-gray-100 cursor-pointer
                            transition duration-300"
                        onClick={handleClose}
                    >
                        <i className="bi bi-chevron-left"></i>
                </button>
                <h1 className="font-black text-2xl">
                    Detalhes produto - {product.name}
                </h1>
                <div
                    className="bg-white p-6 shadow-md flex flex-col gap-2
                     border-l-4 border-brand-300"
                >
                    <div className='text-center p-4 bg-brand-300 text-white
                        font-bold text-2xl'>
                        {product.name}
                    </div>
                    <p className='border-b-2 p-2 border-gray-300 font-semibold'>
                        Data:  {formatTimestamp(product.time)}
                    </p>
                    <p className='border-b-2 p-2 border-gray-300 font-semibold'>
                        Estoque:  {getProductStock(product.name)}
                    </p>
                    <p className='border-b-2 p-2 border-gray-300 font-semibold'>
                        Valor:  {formatPrice(product.value)}
                    </p>
                    <p className='border-b-2 p-2 border-gray-300 font-semibold'>
                        Categoria:  {product.category}
                    </p>
                    <p className='border-b-2 p-2 border-gray-300 font-semibold'>
                        ID:  {product.id}
                    </p>
                    <div className='flex items-center justify-end mt-4 gap-2'>
                        <button
                            className='bg-blue-700 text-white w-30
                                flex gap-2 items-center justify-center
                                p-3 rounded font-bold shadow-md hover:bg-blue-500
                                cursor-pointer transition duration-300 transform
                                hover:-translate-y-1.5'
                            onClick={() => setShowWindowEditProduct(true)}
                        >
                            Editar
                            <i className='bi bi-pen-fill'></i>
                        </button>
                        <button
                            className='bg-red-600 text-white w-30
                                    flex gap-2 items-center justify-center
                                    p-3 rounded font-bold shadow-md hover:bg-red-400
                                    cursor-pointer transition duration-300 transform
                                    hover:-translate-y-1.5'
                            onClick={() => setShowWindowDeleteProduct(true)}
                        >
                            Deletar
                            <i className='bi bi-trash-fill'></i>
                        </button>
                    </div>
                </div>
            </div>
            {showWindowDeleteProduct && (
                <WindowDeleteProduct
                    setShowMessageDelete={setShowMessageProductDeleted}
                    setShow={setShowWindowDeleteProduct}
                    productName={product.name}
                />
            )}
            {showWindowEditProduct && (
                <WindowEditProduct
                    setShow={setShowWindowEditProduct}
                    product={product}
                />
            )}
            {showMessageProductDeleted && (
                <Message
                    setShow={setShowMessageProductDeleted}
                    message='Produto deletado com sucesso!'
                />
            )}
        </div>
    )
}
