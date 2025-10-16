import Menu from './Menu.jsx'


export default function Header({ title, setAuth }) {
    return (
        <header className='flex items-center gap-8 p-10 py-12 bg-brand-300
            shadow-md'>
            <Menu setAuth={setAuth} />
            <h1
                className='text-white font-black text-3xl text-center'
            >
                {title}
            </h1>
        </header>
    )
}
