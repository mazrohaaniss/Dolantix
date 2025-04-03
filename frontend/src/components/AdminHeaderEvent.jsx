
const AdminHeaderEvent = ({activeTab, setActiveTab, category}) => {
    return (
        <>
            <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Acara {category.charAt(0).toUpperCase() + category.slice(1)}</h1>
            </header>

            <div className="mb-6 border-b border-gray-200">
                <nav className="flex -mb-px">
                    <button
                        onClick={() => setActiveTab('list-event')}
                        className={`mr-6 py-4 px-1 ${
                            activeTab === 'list-event'
                                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } transition-colors duration-200 cursor-pointer`}
                    >
                        List Acara
                    </button>
                    <button
                        onClick={() => setActiveTab('add-event')}
                        className={`mr-6 py-4 px-1 ${
                            activeTab === 'add-event'
                                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } transition-colors duration-200 cursor-pointer`}
                    >
                        Tambah Acara
                    </button>
                </nav>
            </div>
        </>
    );
}

export default AdminHeaderEvent;