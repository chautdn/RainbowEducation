const Footer = () => {
    return (<>
        <footer className="bg-indigo-900 text-white py-12">

            <div className="container mx-auto px-4">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((col) => (
                        <div key={col} className="space-y-4">
                            <h3 className="font-bold text-lg mb-4">Danh mục {col}</h3>
                            <ul className="space-y-2 text-sm">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:underline">
                                            Liên kết {col}.{item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="border-t border-indigo-800 mt-12 pt-6 text-sm text-center">
                    <p>© {new Date().getFullYear()} RAINBOW Learning. Tất cả các quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    </>)
}
export default Footer