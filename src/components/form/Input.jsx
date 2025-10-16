import { useEffect, useState } from "react"


export default function Input({ type, id, handleChange, placeholder,
                                label, color, value, width }) {
    const [bgColor, setBgColor] = useState(color)

    useEffect(() => {
        if (!color) {
            setBgColor('bg-white')
        }
    }, [])
    
    return (
        <div className="flex flex-col gap-2 p-4">
            <label
                className="pl-2 text-gray-700"
                htmlFor={id}
            >
                {label}
            </label>
            <input
                onChange={(e) => handleChange(e.target.value)}
                className={`${bgColor} p-3.5 rounded shadow ${width}`}
                placeholder={placeholder}
                value={value}
                type={type}
                id={id}
            />
        </div>
    )
}
