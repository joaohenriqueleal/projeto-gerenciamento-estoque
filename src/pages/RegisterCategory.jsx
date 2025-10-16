import { useEffect, useState } from "react"

import Message from "../components/windows/Message"
import Header from "../components/layout/Header"
import Input from "../components/form/Input"

import loadCategories from "../shared/category/loadCategories"
import saveCategories from "../shared/category/saveCategories"
import loadActualUser from "../shared/user/loadActualUser"

export default function RegisterCategory() {
    const [showMessageInvalidInputs, setShowMessageInvalidInputs] = useState(false)
    const [showMessageHasCategory, setShowMessageHasCategory] = useState(false)
    const [showMessageSuccess, setShowMessageSuccess] = useState(false)

    const [categoryName, setCategoryName] = useState("")
    const [goalCategoryMonth, setGoalCategoryMonth] = useState(0)
    const [categoryDescription, setCategoryDescription] = useState("")
    const [categoryColor, setCategoryColor] = useState("#ffa500")

    const [categories, setCategories] = useState([])
    const [actualUser, setActualUser] = useState("")

    useEffect(() => {
        const user = loadActualUser()
        setActualUser(user)
    }, [])

    useEffect(() => {
        if (actualUser) {
            setCategories(loadCategories(actualUser))
        }
    }, [actualUser])

    const addCategory = (e) => {
        e.preventDefault()

        if (!categoryName || !goalCategoryMonth || !categoryDescription) {
            setShowMessageInvalidInputs(true)
            return
        }

        const existingCategory = categories.find(
            (c) => c.name === categoryName
        )
        if (existingCategory) {
            setShowMessageHasCategory(true)
            return
        }

        const newCategories = [
            ...categories,
            {
                name: categoryName,
                goal: goalCategoryMonth,
                description: categoryDescription,
                color: categoryColor,
                time: Date.now(),
            },
        ]

        setCategories(newCategories)
        saveCategories(actualUser, newCategories)
        setShowMessageSuccess(true)

        setCategoryName("")
        setGoalCategoryMonth(0)
        setCategoryDescription("")
        setCategoryColor("#ffa500")
    }

    return (
        <>
            <Header title="Cadastrar categoria" />

            <main className="flex flex-col items-center gap-12 p-12">
                <h1 className="font-black text-2xl">
                    Insira os dados da categoria
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

                    <div className="flex flex-col justify-center gap-2
                        p-4">
                        <label
                            htmlFor="inputColor"
                            className="mb-1 pl-2 text-gray-700"
                        >
                            Cor da categoria:
                        </label>
                        <input
                            type="color"
                            id="inputColor"
                            value={categoryColor}
                            onChange={(e) =>
                                setCategoryColor(e.target.value)
                            }
                            className="h-12 shadow-md cursor-pointer w-34"
                        />
                    </div>

                    <button
                        className="p-4 mt-6 self-end bg-brand-300
                            rounded text-white font-bold text-xl shadow-md
                            w-40 hover:bg-brand-200 cursor-pointer transition
                            duration-300 transform hover:-translate-y-1.5
                            hover:shadow-xl"
                        onClick={addCategory}
                    >
                        Adicionar
                    </button>
                </form>

                {showMessageInvalidInputs && (
                    <Message
                        message="Por favor, preencha todos os campos corretamente."
                        setShow={setShowMessageInvalidInputs}
                        type="error"
                    />
                )}

                {showMessageHasCategory && (
                    <Message
                        message="Essa categoria já foi cadastrada!"
                        setShow={setShowMessageHasCategory}
                        type="error"
                    />
                )}

                {showMessageSuccess && (
                    <Message
                        message="Categoria adicionada com sucesso!"
                        setShow={setShowMessageSuccess}
                        type="success"
                    />
                )}
            </main>
        </>
    )
}
