import { ThemeProvider } from '@renderer/components/ui/theme-provider'
import Sidebar from './components/sidebar'
import DashboardPage from './components/pages/dashboard/dashboard-page'
import { useState } from 'react'

function App(): React.JSX.Element {
  const [activeItem, setActiveItem] = useState('dashboard')

  const handleItemClick = (item: string): void => {
    setActiveItem(item)
  }

  const renderContent = (): React.JSX.Element => {
    switch (activeItem) {
      case 'dashboard':
        return <DashboardPage />
      case 'masks':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Masks</h1>
            <div className="text-gray-300">Masks content goes here...</div>
          </div>
        )
      default:
        return <DashboardPage />
    }
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="flex h-screen">
        <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
        <main className="flex-1 overflow-hidden">{renderContent()}</main>
      </div>
    </ThemeProvider>
  )
}

export default App
