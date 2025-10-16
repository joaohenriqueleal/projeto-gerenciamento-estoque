import { useEffect, useRef, useState } from "react"

import loadCategories from '../../shared/category/loadCategories'
import saveCategories from '../../shared/category/saveCategories'
import loadActualUser from '../../shared/user/loadActualUser'
import loadProducts from '../../shared/product/loadProducts'
import saveProducts from '../../shared/product/saveProducts'

import Message from "./Message"
import Input from "../form/Input"


export default function WindowEditCategory({ setShow, category }) {
    const [showMessageInvalidInputs, setShowMessageInvalidInputs] = useState(false)
    const [showMessageCtegoryEdited, setShowMessageCtegoryEdited] = useState(false)

    const [actualUser, setActualUser] = useState('')
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])

    const [categoryName, setCategoryName] = useState('')
    const [goalCategoryMonth, setGoalCategoryMonth] = useState(0)
    const [categoryDescription, setCategoryDescription] = useState('')
    const [categoryColor, setCategoryColor] = useState('#ffa500')

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
        if (category) {
            setCategoryName(category.name)
            setGoalCategoryMonth(category.goal)
            setCategoryDescription(category.description)
            setCategoryColor(category.color)
        }
    }, [category])

    const editCategory = (e) => {
        e.preventDefault()

        if (!categoryName || !goalCategoryMonth || !categoryDescription || !categoryColor) {
            setShowMessageInvalidInputs(true)
            return
        }

        const alteredName = categoryName !== category.name

        const newCategoriesList = categories.map((c) => {
            if (c.name === category.name) {
                return {
                    name: categoryName,
                    goal: goalCategoryMonth,
                    description: categoryDescription,
                    color: categoryColor,
                    time: category.time
                }
            }
            return c
        })

        let newProductsList = products
        if (alteredName) {
            newProductsList = products.map((p) =>
                p.category === category.name
                    ? { ...p, category: categoryName }
                    : p
            )
            setProducts(newProductsList)
            saveProducts(actualUser, newProductsList)
        }

        setCategories(newCategoriesList)
        saveCategories(actualUser, newCategoriesList)
        setShowMessageCtegoryEdited(true)
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
                    Editar categoria - {category.name}
                </h1>
                <form
                    className="w-full border-l-4 border-brand-300 p-4
                        md:w-200 flex flex-col gap-4"
                >
                    <Input
                        type="text"
                        id="inputName"
                        color="bg-gray-100"
                        label="Nome da categoria:"
                        handleChange={setCategoryName}
                        placeholder="Insira o nome da categoria"
                        value={categoryName}
                    />

                    <Input
                        type="number"
                        id="inputGoal"
                        color="bg-gray-100"
                        label="Meta mensal da categoria:"
                        handleChange={setGoalCategoryMonth}
                        placeholder="Insira sua meta mensal da categoria R$"
                        value={goalCategoryMonth}
                    />

                    <Input
                        type="text"
                        id="inputDescription"
                        color="bg-gray-100"
                        label="Descrição da categoria:"
                        handleChange={setCategoryDescription}
                        placeholder="Insira a descrição da categoria"
                        value={categoryDescription}
                    />

                    <div className="flex flex-col justify-center gap-2 p-4">
                        <label htmlFor="inputColor" className="mb-1 pl-2 text-gray-700">
                            Cor da categoria:
                        </label>
                        <input
                            type="color"
                            id="inputColor"
                            value={categoryColor}
                            onChange={(e) => setCategoryColor(e.target.value)}
                            className="h-12 shadow-md cursor-pointer w-34"
                        />
                    </div>

                    <button
                        type="button"
                        className="p-4 mt-6 self-end bg-blue-700
                            rounded text-white font-bold text-xl shadow-md
                            w-40 hover:bg-blue-500 cursor-pointer transition
                            duration-300 transform hover:-translate-y-1.5
                            hover:shadow-xl"
                        onClick={editCategory}
                    >
                        Editar
                    </button>
                </form>
            </div>
            {showMessageInvalidInputs && (
                <Message
                    message='Por favor, preencha todos os campo corretamente!'
                    setShow={setShowMessageInvalidInputs}
                    type='error'
                />
            )}
            {showMessageCtegoryEdited && (
                <Message
                    message='Categoria editada com sucesso!'
                    setShow={setShowMessageCtegoryEdited}
                />
            )}
        </div>
    )
}
