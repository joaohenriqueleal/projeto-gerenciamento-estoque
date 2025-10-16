import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"

import CategoryDetailsWindow from '../components/windows/CategoryDetailsWindow'
import ProductDetailsWindow from '../components/windows/ProductDetailsWindow'
import Header from "../components/layout/Header"
import Input from "../components/form/Input"

import loadCategories from "../shared/category/loadCategories"
import loadActualUser from "../shared/user/loadActualUser"
import loadProducts from "../shared/product/loadProducts"
import loadReleases from '../shared/relese/loadReleases'

import formatPrice from '../utils/formatPrice'


export default function GridView() {
    const [releases, setReleases] = useState([])
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [allProducts, setAllProducts] = useState([])

    useEffect(() => {
        const user = loadActualUser()
        if (user) {
            const cats = loadCategories(user)
            const prods = loadProducts(user)
            const rels = loadReleases(user)

            setCategories(cats)
            setProducts(prods)
            setAllCategories(cats)
            setAllProducts(prods)
            setReleases(rels)
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

    const [showWindowCategoryDetails, setShowWindowCategoryDetails] = useState(false)
    const [showWindowProductDetails, setShowWindowProductDetails] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState({})
    const [selectedProduct, setSelectedProduct] = useState({})
    const [search, setSearch] = useState('')

    const showCategoryDetails = (category) => {
        setSelectedCategory(category)
        setShowWindowCategoryDetails(true)
    }

    const showProductDetails = (product) => {
        setShowWindowProductDetails(true)
        setSelectedProduct(product)
    }

    const handleSearch = () => {
        if (!search.trim()) {
            setCategories(allCategories)
            setProducts(allProducts)
            return
        }

        const s = search.toLowerCase()

        const filteredCats = allCategories.filter((c) => {
            const data = { ...c }
            delete data.time
            const joined = Object.values(data).join(' ').toLowerCase()
            return joined.includes(s)
        })

        const filteredProds = allProducts.filter((p) => {
            const data = { ...p }
            delete data.time
            const joined = Object.values(data).join(' ').toLowerCase()
            return joined.includes(s)
        })

        setCategories(filteredCats)
        setProducts(filteredProds)
    }

    const getTotalValueOfCategory = (name) => {
        let total = 0
        allProducts.map((p) => {
            if (p.category == name) total += getProductStock(p.name) * p.value
        })
        return total
    }

    const getTotalCategoryItems = (categoryName) => {
        let total = 0
        allProducts.map((p) => {
            if (p.category == categoryName) {
                total += getProductStock(p.name)
            }
        })
        return total
    }

    return (
        <>
            <Header title='Visualizar produtos e categorias' />
            <main className="p-4 flex flex-col items-center gap-12">
                <section className="md:w-190 lg:w-250">
                    <div className="flex w-full items-center justify-center">
                        <Input
                            type='text'
                            id='inputSearch'
                            label='Pesquisa:'
                            color='bg-gray-200'
                            handleChange={setSearch}
                            width='w-70 md:w-100 lg:w-200'
                            placeholder='Insira data/nome/valor etc.'
                            value={search}
                        />
                        <button
                            className="flex items-center justify-center gap-1 bg-brand-300 p-3.5 rounded shadow transform translate-y-3 text-white font-bold text-xl hover:bg-brand-200 cursor-pointer transition duration-300"
                            onClick={handleSearch}
                        >
                            Pesquisar <FaSearch />
                        </button>
                    </div>
                </section>
                <section className="w-full md:w-190 lg:w-250">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-center py-1 px-4 font-black text-2xl">
                            Dados das categorias
                        </h1>
                        <p className="pb-8 text-center font-bold text-gray-600 w-100 md:w-full">
                            Clique na categoria ou produto desejada pra editar ou deletar
                        </p>
                    </div>
                    <table className="w-full border shadow border-gray-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-brand-100 text-center">
                                <th className="p-3 w-[40%]">Nome</th>
                                <th className="p-3 w-[20%]">Total</th>
                                <th className="p-3 w-[45%]">Itens</th>
                                <th className="p-3 w-[20%]">Meta</th>
                                <th className="p-3 w-[5%]">Cor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? (
                                categories.map((c, i) => (
                                    <tr
                                        key={i}
                                        className="border-t border-gray-200 hover:bg-orange-50 transition cursor-pointer"
                                        onClick={() => showCategoryDetails(c)}
                                    >
                                        <td className="p-3 text-center text-gray-600 font-bold">{c.name}</td>
                                        <td className="p-3 text-center text-gray-600 font-bold">{formatPrice(getTotalValueOfCategory(c.name))}</td>
                                        <td className="p-3 text-center text-gray-600 font-bold">{getTotalCategoryItems(c.name)}</td>
                                        <td className="p-3 text-center text-gray-600 font-bold">{formatPrice(c.goal) || '-'}</td>
                                        <td className="p-3 text-center">
                                            <div
                                                className="w-6 h-6 rounded-full border border-gray-300"
                                                style={{ backgroundColor: c.color || '#ccc' }}
                                            ></div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-400">
                                        Nenhuma categoria encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
                <section className="w-full md:w-190 lg:w-250">
                    <h1 className="font-black text-2xl text-center pb-8">
                        Dados dos produtos
                    </h1>
                    <table className="w-full border shadow border-gray-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-brand-100 text-center">
                                <th className="p-3 w-[50%]">Nome</th>
                                <th className="p-3 w-[20%]">Valor</th>
                                <th className="p-3 w-[50%]">Categoria</th>
                                <th className="p-3 w-[5%]">ID</th>
                                <th className="p-3 w-[5%]">Estoque</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((p, i) => (
                                    <tr
                                        key={i}
                                        className="border-t border-gray-200 hover:bg-orange-50 transition cursor-pointer"
                                        onClick={() => showProductDetails(p)}
                                    >
                                        <td className="p-3 text-center text-gray-600 font-bold">{p.name}</td>
                                        <td className="p-3 text-center text-gray-600 font-bold">{formatPrice(p.value)}</td>
                                        <td className="p-3 text-center text-gray-600 font-bold">{p.category}</td>
                                        <td className="p-3 text-center text-gray-600 font-bold">{p.id}</td>
                                        <td className="p-3 text-center text-gray-600 font-bold">{getProductStock(p.name)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-400">
                                        Nenhum produto encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
                {showWindowCategoryDetails && (
                    <CategoryDetailsWindow
                        totalItems={getTotalCategoryItems(selectedCategory.name)}
                        totalValue={getTotalValueOfCategory(selectedCategory.name)}
                        setShow={setShowWindowCategoryDetails}
                        category={selectedCategory}
                    />
                )}
                {showWindowProductDetails && (
                    <ProductDetailsWindow
                        setShow={setShowWindowProductDetails}
                        getProductStock={getProductStock}
                        product={selectedProduct}
                    />
                )}
            </main>
        </>
    )
}
