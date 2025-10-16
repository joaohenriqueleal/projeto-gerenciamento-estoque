import { FaBox, FaTrash } from "react-icons/fa"
import formatTimestamp from "../../utils/formatTimestamp"


export default function ReleaseItem({ release, deleteRelease }) {
    return (
        <div
            className="bg-white w-full p-4 rounded-xl shadow
                flex flex-col gap-4"
        >
            <h1
                className="font-black"
            >
                {release.productName}
            </h1>
            <div
                className="flex gap-2"
            >
                <div
                    className="p-2 border-l-4 border-brand-500 flex flex-col
                        gap-0.5 w-1/2"
                >
                    <p
                        className="text-sm text-gray-600 font-bold"
                    >
                        Data: {formatTimestamp(release.time)}
                    </p>
                    <p
                        className="text-sm text-gray-600 font-bold"
                    >
                        Quantidade: {release.qtd}
                    </p>
                        {release.type == 'sub' ? (
                            <p
                                className="bg-red-500 p-1 px-2 rounded text-white
                                    font-bold flex items-center gap-2"
                            >
                                <FaBox />
                                Subtriando-
                            </p>
                        ) : (
                            <p
                                className="bg-green-600 p-1 px-2 rounded text-white
                                    font-bold flex items-center gap-2"
                            >
                                <FaBox />
                                Somando+
                            </p>
                        )}
                </div>
                <div
                    className="flex items-end justify-end grow"
                >
                    <button
                        className="shadow-md p-2 bg-red-500 rounded text-white font-bold
                            flex items-center gap-1 hover:bg-red-400 cursor-pointer
                            transition duration-300"
                        onClick={() => deleteRelease(release)}
                    >
                        <FaTrash />
                        Deletar
                    </button>
                </div>
            </div>
        </div>
    )
}
