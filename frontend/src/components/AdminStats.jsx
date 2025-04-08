const AdminStats = () => {
    return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Events</h3>
                    <p className="text-3xl font-bold text-blue-600">2</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Latest Event</h3>
                    <p className="text-3xl font-bold text-blue-600">2</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Pending Orders</h3>
                    <p className="text-3xl font-bold text-orange-500">1</p>
                </div>
            </div>
    );
};

export default AdminStats;
