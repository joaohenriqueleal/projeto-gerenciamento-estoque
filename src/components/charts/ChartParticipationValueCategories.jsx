import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { Pie } from 'react-chartjs-2'

import loadCategories from '../../shared/category/loadCategories'
import loadActualUser from '../../shared/user/loadActualUser'
import formatarPrice from '../../utils/formatPrice'

import { useEffect, useState } from 'react'


Chart.register(ArcElement, Tooltip, Legend, Title)

export default function ChartParticipationValueCategories({ getTotalValueOfCategory }) {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const user = loadActualUser()
        if (user) {
            setCategories(loadCategories(user))
        }
    }, [])

    const [labels, setLabels] = useState([])
    const [data, setData] = useState([])
    const [colors, setColors] = useState([])
    const title = 'Valor por categorias'

    useEffect(() => {
        setCategoriesDatas()
    }, [categories])

    const setCategoriesDatas = () => {
        if (!categories || categories.length === 0) {
            setLabels([])
            setData([])
            setColors([])
            return
        }

        const filtered = categories.filter(c => getTotalValueOfCategory(c.name) > 0)
        setLabels(filtered.map(c => c.name))
        setData(filtered.map(c => getTotalValueOfCategory(c.name)))
        setColors(filtered.map(c => c.color || '#ccc'))
    }

    const chartData = {
        labels: labels,
        datasets: [
            {
                data,
                backgroundColor: colors,
                borderColor: 'rgba(255,255,255,0.8)',
                borderWidth: 1,
                hoverOffset: 12
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                align: 'center',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            title: {
                padding: {
                    top: 8,
                    bottom: 16
                },
                font: {
                    size: 16,
                    weight: '600'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.parsed || 0
                        const total = context.dataset.data.reduce((s, v) => s + v, 0)
                        const pct = total ? ((value / total) * 100).toFixed(1) : 0
                        return `${context.label}: ${formatarPrice(value)} (${pct}%)`
                    }
                }
            }
        }
    }

    return (
        <div className='p-2 flex flex-col items-center justify-center gap-4'>
            <div className="flex items-start justify-between">
                <h3
                    className="text-xl font-semibold text-slate-800
                        text-center"
                >
                    {title}
                </h3>
            </div>
            {categories.length > 0 ? (
                <div
                    className="h-64 md:h-80 flex items-center justify-center"
                >
                    <Pie data={chartData} options={options} />
                </div>
            ) : (
                <p
                    className='text-gray-600'
                >
                    Nenhuma categoria cadastrada.
                </p>
            )}
        </div>
    )
}
