import WindowDeleteCategory from './WindowDeleteCategory'
import WindowEditCategory from './WindowEditCategory'
import Message from './Message'

import formatTimestamp from '../../utils/formatTimestamp'
import formatPrice from '../../utils/formatPrice'

import { useRef, useState } from "react"


export default function CategoryDetailsWindow({ setShow, category, totalItems, totalValue }) {
    const [showMessageCategoryDeleted, setShowMessageCategoryDeleted] = useState(false)
    const [showWindowDeleteCategory, setShowWindowDeleteCategory] = useState(false)
    const [showWindowEditCategory, setShowWindowEditCategory] = useState(false)
    
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
                    Detalhes categoria - {category.name}
                </h1>
                <div
                    className="bg-white p-6 shadow-md flex flex-col gap-2
                     border-l-4 border-brand-300"
                >
                    <div className='text-center p-4 bg-brand-300 text-white
                        font-bold text-2xl'>
                        {category.name}
                    </div>
                    <p className='border-b-2 p-2 border-gray-300 font-semibold'>
                        Data:  {formatTimestamp(category.time)}
                    </p>
                    <p className='border-b-2 p-2 border-gray-300 font-semibold'>
                        Meta:  {formatPrice(category.goal)}
                    </p>
                    <p className='border-b-2 p-2 border-gray-300 font-semibold'>
                        Descrição:  {category.description}
                    </p>
                    <p className='border-b-2 p-2 border-gray-300 font-semibold'>
                        Total itens:  {totalItems}
                    </p>
                    <p className='border-b-2 p-2 border-gray-300 font-semibold'>
                        Valor Total:  {formatPrice(totalValue)}
                    </p>
                    <div className='border-b-2 p-2 border-gray-300 font-semibold
                            flex gap-2'>
                        Cor da categoria:
                        <div
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: category.color || '#ccc' }}
                        ></div>
                    </div >
                    <div className='flex items-center justify-end mt-4 gap-2'>
                        <button
                            className='bg-blue-700 text-white w-30
                                flex gap-2 items-center justify-center
                                p-3 rounded font-bold shadow-md hover:bg-blue-500
                                cursor-pointer transition duration-300 transform
                                hover:-translate-y-1.5'
                            onClick={() => setShowWindowEditCategory(true)}
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
                            onClick={() => setShowWindowDeleteCategory(true)}
                        >
                            Deletar
                            <i className='bi bi-trash-fill'></i>
                        </button>
                    </div>
                </div>
            </div>
            {showWindowDeleteCategory && (
                <WindowDeleteCategory
                    setShow={setShowWindowDeleteCategory}
                    setShowMessageDelete={setShowMessageCategoryDeleted}
                    categoryName={category.name}
                />
            )}
            {showWindowEditCategory && (
                <WindowEditCategory
                    setShow={setShowWindowEditCategory}
                    category={category}
                />
            )}
            {showMessageCategoryDeleted && (
                <Message
                setShow={setShowMessageCategoryDeleted}
                    message='Categoria deletada com sucesso!'
                />
            )}
        </div>
    )
}
