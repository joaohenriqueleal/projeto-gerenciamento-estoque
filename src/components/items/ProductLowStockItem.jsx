export default function ProductLowStockItem({ name, stock }) {
    return (
        <div
            className="border-3 p-3 border-red-600 rounded shadow flex
                items-center justify-between"
        >
            <h1
                className="font-bold text-red-800"
            >
                {name}
            </h1>
            <p
                className="bg-red-600 p-1.5 rounded text-white font-bold
                    px-4"
            >
                {stock} Itens
            </p>
        </div>
    )
}
