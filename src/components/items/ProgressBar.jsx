import formatarPrice from "../../utils/formatPrice"
import { useEffect, useState } from "react"


export default function ProgressBar({ category, getLastMonthValueOfCategory, releases }) {
    const [bgBar, setBgBar] = useState('bg-green-600')

    const meta = Number(category.goal)
    const gastoMes = getLastMonthValueOfCategory(category.name)
    const percent = gastoMes / meta * 100

    const defineBgBar = () => {
        if (percent > 99) setBgBar('bg-red-500')
        else if (percent > 69) setBgBar('bg-yellow-500')
        else setBgBar('bg-green-600')
    }

    useEffect(() => {
        defineBgBar()
    }, [category, releases, percent])

    return (
        <div className="w-full flex flex-col">
            <h2 className="font-black pl-2">
                {category.name}
            </h2>
            <div className='bg-gray-300 w-full rounded-2xl shadow flex items-center overflow-hidden'>
                <div
                    className={`${bgBar} p-2 px-3 text-white font-bold transition-all duration-300`}
                    style={{width: `${percent}%`}}
                >
                    {percent.toFixed(2)}%
                </div>
            </div>
            <div className="flex items-center justify-between px-2">
                <p className="text-gray-600 font-bold text-sm pt-2">
                    Gasto este mês: {formatarPrice(gastoMes)}
                </p>
                <p className="text-gray-600 font-bold text-sm pt-2">
                    {formatarPrice(Number(category.goal))}
                </p>
            </div>
        </div>
    )
}
