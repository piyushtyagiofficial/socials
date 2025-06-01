import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import BottomBar from "./BottomBar"

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-16">
        {" "}
        {/* Add padding-top to account for fixed navbar */}
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-4xl mx-auto px-4 py-6 pb-20 lg:pb-6">{children}</div>        </main>
      </div>
       <BottomBar />
    </div>
  )
}

export default Layout
