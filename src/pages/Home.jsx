import { useState, useEffect } from 'react'

import ChartParticipationValueCategories from '../components/charts/ChartParticipationValueCategories.jsx'
import ChartEvolutionStockValue from '../components/charts/ChartEvolutionStockValue'
import ProductLowStockItem from '../components/items/ProductLowStockItem'
import ProgressBar from '../components/items/ProgressBar'
import Header from '../components/layout/Header'

import loadCategories from '../shared/category/loadCategories'
import loadActualUser from '../shared/user/loadActualUser'
import loadProducts from '../shared/product/loadProducts'
import loadReleases from '../shared/relese/loadReleases'

import formatNumber from '../utils/formatNumber'
import formatPrice from '../utils/formatPrice'


export default function Home({ setAuth }) {
    const [actualUser, setActualUser] = useState('')

    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [releases, setReleases] = useState([])
    const [lowProducts, setLowProducts] = useState([]) // 👈 novo state

    useEffect(() => {
        const user = loadActualUser()
        if (user) {
            const cats = loadCategories(user)
            const prods = loadProducts(user)
            const rels = loadReleases(user)

            setCategories(cats)
            setProducts(prods)
            setReleases(rels)
            setActualUser(user)

            // 👇 calcula os produtos com baixo estoque logo após o carregamento
            const lows = prods.filter(p => {
                let stock = p.storage
                rels.forEach(r => {
                    if (r.productName === p.name) {
                        if (r.type === 'sub') stock -= Number(r.qtd)
                        else if (r.type === 'sum') stock += Number(r.qtd)
                    }
                })
                return stock < 10
            })
            setLowProducts(lows)
        }
    }, [])

    const getProductStock = (productName) => {
        let productStock = 0

        products.map((p) => {
            if (p.name == productName) {
                productStock = p.storage
            }
        })

        releases.map((r) => {
            if (r.productName == productName) {
                if (r.type == 'sub') productStock -= Number(r.qtd)
                else if (r.type == 'sum') productStock += Number(r.qtd)
            }
        })

        return productStock
    }

    const getTotalProducts = () => {
        let total = 0
        products.map((p) => {
            total += getProductStock(p.name)
        })
        return total
    }

    const getTotalCategoryItems = (categoryName) => {
        let total = 0
        products.map((p) => {
            if (p.category == categoryName) {
                total += getProductStock(p.name)
            }
        })
        return total
    }

    const getTotalValueOfCategory = (name) => {
        let total = 0
        products.map((p) => {
            if (p.category == name) total += getProductStock(p.name) * p.value
        })
        return total
    }

    const getTotalStockValue = () => {
        let total = 0
        categories.map((c) => {
            total += getTotalValueOfCategory(c.name)
        })
        return total
    }

    const getLastMonthValueOfCategory = (categoryName) => {
        const now = Date.now()
        const lastMonth = now - 30 * 24 * 60 * 60 * 1000
        let total = 0

        products.forEach((p) => {
            if (p.category === categoryName) {
                const productReleases = releases.filter(r =>
                    r.productName === p.name &&
                    new Date(r.time).getTime() >= lastMonth
                )
                productReleases.forEach(r => {
                    total += Number(r.qtd) * Number(p.value)
                })
                if (p.time && new Date(p.time).getTime() >= lastMonth) {
                    total += Number(p.storage || 0) * Number(p.value)
                }
            }
        })

        return total
    }

    return (
        <div className='flex flex-col'>
            <Header
                title={`Gerenciamento de estoque - ${actualUser}`}
                setAuth={setAuth}
            />
            <main
                className='bg-gray-200 w-full p-8 gap-6 m-auto shadow-md
                    flex flex-col md:grid grid-cols-2 max-w-450
                    md:bg-gray-100'
            >
                <section
                    className='p-6 bg-white h-40 rounded-xl shadow
                        w-full flex flex-col gap-4'
                >
                    <h1 className='text-2xl'>Total de produtos</h1>
                    <h2 className='text-6xl font-extralight'>
                        {formatNumber(getTotalProducts())}
                    </h2>
                </section>

                <section
                    className='p-6 bg-white h-40 rounded-xl shadow
                        w-full flex flex-col gap-4'
                >
                    <h1 className='text-2xl'>Valor total do estoque</h1>
                    <h2
                        className='text-5xl font-extralight
                            text-gray-700'
                    >
                        {formatPrice(getTotalStockValue())}
                    </h2>
                </section>

                <section
                    className='bg-white p-6 rounded-xl shadow flex
                        flex-col gap-6'
                >
                    <h1 className='font-black text-xl text-center'>
                        Produtos por categoria
                    </h1>
                    <div className='flex flex-col'>
                        <div
                            className='flex items-center justify-between px-2
                                mb-2 font-bold'
                        >
                            <p>Categoria</p>
                            <p>Itens</p>
                        </div>
                        {categories.length > 0 ? (
                            categories.map((c, i) => (
                                <div
                                    className='border-b-2 border-gray-300
                                        flex items-center justify-between p-2'
                                    key={i}
                                >
                                    <div className='flex gap-2'>
                                        <p className='font-bold'>{c.name}</p>
                                        <div
                                            className='h-5 w-5 rounded-full'
                                            style={{ backgroundColor: c.color }}
                                        ></div>
                                    </div>
                                    <p>{formatNumber(getTotalCategoryItems(c.name))}</p>
                                </div>
                            ))
                        ) : (
                            <p className='text-gray-600 text-center pt-6'>
                                Nenhuma categoria cadastrada.
                            </p>
                        )}
                    </div>
                </section>

                <section
                    className='bg-white p-6 rounded-xl shadow w-full h-max'
                >
                    <ChartParticipationValueCategories
                        getTotalValueOfCategory={getTotalValueOfCategory}
                    />
                </section>

                <section
                    className='bg-white p-6 rounded-xl shadow w-full m-auto
                        flex flex-col gap-4 items-center'
                >
                    <h1 className='font-black pb-2 text-xl'>
                        Progresso das suas metas
                    </h1>
                    {categories.length > 0 ? (
                        categories.map((c, i) => (
                            <ProgressBar
                                getLastMonthValueOfCategory={getLastMonthValueOfCategory}
                                category={c}
                                key={i}
                            />
                        ))
                    ) : (
                        <p className='text-center p-2 text-gray-500'>
                            Nenhuma categoria encontrada.
                        </p>
                    )}
                </section>

                <section
                    className='bg-white p-6 rounded-xl shadow w-full h-96
                        flex flex-col items-center'
                >
                    <ChartEvolutionStockValue />
                </section>

                <section
                    className='bg-white p-6 rounded-xl shadow w-full
                        flex flex-col gap-4'
                >
                    <h1 className='font-black pb-2 text-xl text-center'>
                        Produtos com baixo estoque
                    </h1>
                    {lowProducts.length > 0 ? (
                        lowProducts.map((p, i) => (
                            <ProductLowStockItem
                                stock={getProductStock(p.name)}
                                name={p.name}
                                key={i}
                            />
                        ))
                    ) : (
                        <p className='text-gray-500'>
                            Nenhum produto com baixo estoque.
                        </p>
                    )}
                </section>
            </main>
        </div>
    )
}
