import { useEffect, useRef } from "react"


export default function Message({ setShow, message, type }) {
    const popupRef = useRef(null)
    const bgColor = type === "error" ? "bg-brand-200" : "bg-green-400"
    const borderColor = type === "error" ? "border-brand-400" : "border-green-500"

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose()
        }, 5000)
        return () => clearTimeout(timer)
    }, [setShow])

    const handleClose = () => {
        if (popupRef.current) {
            popupRef.current.classList.remove("animate-popup-in")
            popupRef.current.classList.add("animate-popup-out")
        }

        const onAnimationEnd = () => {
            setShow(false)
        }

        popupRef.current.addEventListener("animationend", onAnimationEnd)
    }

    return (
        <div
            className={`fixed top-4 right-4 w-70 flex items-center justify-between
                p-2 ${bgColor} border-3 ${borderColor} rounded shadow-lg
                text-white font-bold h-min animate-popup-in`}
            ref={popupRef}
        >
            <span className="max-h-12">{message}</span>
            <button
                className={`ml-2 text-white font-bold text-xl hover:text-gray-100 transition
                    cursor-pointer hover:bg-gray-300/70 p-2 px-3 rounded-full`}
                onClick={handleClose}
            >
                &times;
            </button>
        </div>
    )
}
