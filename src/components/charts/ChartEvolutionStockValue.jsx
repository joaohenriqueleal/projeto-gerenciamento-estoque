import loadActualUser from "../../shared/user/loadActualUser"
import loadProducts from "../../shared/product/loadProducts"
import loadReleases from "../../shared/relese/loadReleases"
import formatPrice from "../../utils/formatPrice"
import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title, Filler } from "chart.js"

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title, Filler)

const PERIODS = [
    { label: "Tudo", value: "all" },
    { label: "1 ano", value: "1y" },
    { label: "1 mês", value: "1m" },
    { label: "1 semana", value: "1w" }
]

function getPeriodStart(period) {
    const now = Date.now()
    if (period === "1y") return now - 365 * 24 * 60 * 60 * 1000
    if (period === "1m") return now - 30 * 24 * 60 * 60 * 1000
    if (period === "1w") return now - 7 * 24 * 60 * 60 * 1000
    return 0
}

export default function ChartEvolutionStockValue() {
    const [actualUser, setActualUser] = useState('')
    const [products, setProducts] = useState([])
    const [releases, setReleases] = useState([])
    const [period, setPeriod] = useState("1m")
    const [chartData, setChartData] = useState({ labels: [], datasets: [] })

    useEffect(() => {
        const user = loadActualUser()
        if (user) {
            setActualUser(user)
            setProducts(loadProducts(user))
            setReleases(loadReleases(user))
        }
    }, [])

    useEffect(() => {
        if (products.length === 0) {
            setChartData({ labels: [], datasets: [] })
            return
        }

        let events = []
        products.forEach(p => {
            events.push({
                type: 'add_product',
                time: p.time || 0,
                product: p
            })
        })
        releases.forEach(r => {
            events.push({
                type: 'release',
                time: r.time,
                release: r
            })
        })
        events.sort((a, b) => a.time - b.time)

        let stockByProduct = {}
        let productsByName = {}
        products.forEach(p => {
            productsByName[p.name] = p
        })

        let labels = []
        let data = []
        let firstDate = events.length > 0 ? new Date(events[0].time).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
        labels.push(firstDate)
        let initialTotal = 0
        products.forEach(p => {
            if (!events.length || (p.time || 0) <= events[0].time) {
                stockByProduct[p.name] = p.storage || 0
                initialTotal += (p.storage || 0) * (p.value || 0)
            }
        })
        data.push(initialTotal)

        events.forEach(ev => {
            if (ev.type === 'add_product') {
                stockByProduct[ev.product.name] = ev.product.storage || 0
            } else if (ev.type === 'release') {
                const r = ev.release
                if (stockByProduct[r.productName] === undefined) {
                    return
                }
                if (r.type === "sub") stockByProduct[r.productName] -= Number(r.qtd)
                if (r.type === "sum") stockByProduct[r.productName] += Number(r.qtd)
            }
            let total = 0
            Object.keys(stockByProduct).forEach(name => {
                const prod = productsByName[name]
                if (prod) {
                    total += (stockByProduct[name] || 0) * (prod.value || 0)
                }
            })
            const label = new Date(ev.time).toISOString().slice(0, 10)
            labels.push(label)
            data.push(total)
        })

        const start = getPeriodStart(period)
        const filteredLabels = []
        const filteredData = []
        labels.forEach((label, idx) => {
            const dateValue = new Date(label).getTime()
            if (period === "all" || dateValue >= start) {
                filteredLabels.push(label)
                filteredData.push(data[idx])
            }
        })

        setChartData({
            labels: filteredLabels,
            datasets: [
                {
                    label: "Valor total do estoque",
                    data: filteredData,
                    fill: true,
                    borderColor: "#2563eb",
                    backgroundColor: "rgba(37,99,235,0.1)",
                    tension: 0.3
                }
            ]
        })
    }, [products, releases, period])

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                font: { size: 18 }
            },
            tooltip: {
                callbacks: {
                    label: ctx => formatPrice(ctx.parsed.y)
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: value => formatPrice(value)
                }
            }
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-1">
                        Evolução do valor total do estoque
                    </h2>
                    <span className="text-slate-500 text-xs">
                        Acompanhe o valor do estoque ao longo do tempo
                    </span>
                </div>
                <div className="flex md:flex-col lg:flex-row gap-2">
                    {PERIODS.map(p => (
                        <button
                            key={p.value}
                            className={`px-3 py-1 rounded-full border transition-all duration-200 font-semibold text-xs
                                ${period === p.value
                                    ? "bg-blue-600 text-white border-blue-600 shadow"
                                    : "bg-gray-100 text-slate-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"}`}
                            onClick={() => setPeriod(p.value)}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-full w-full">
                {chartData.labels.length > 0 ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <span className="text-slate-400 font-semibold text-base">
                        Nenhum dado para exibir neste período
                    </span>
                )}
            </div>
        </>
    )
}
