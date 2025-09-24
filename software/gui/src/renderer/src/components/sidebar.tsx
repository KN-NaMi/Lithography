import { IconHome, IconSettings, IconMasksTheater } from '@tabler/icons-react'

interface SidebarProps {
  activeItem?: string
  onItemClick?: (item: string) => void
}

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <IconHome size={20} /> },
  { id: 'masks', label: 'masks', icon: <IconMasksTheater size={20} /> }
]

function Sidebar({ activeItem = 'dashboard', onItemClick }: SidebarProps): React.JSX.Element {
  return (
    <div className="text-white flex flex-col h-screen w-16 bg-sidebar">
      <div className="p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={`w-full flex items-center p-3 rounded-lg mb-1 transition-colors ${
              activeItem === item.id
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
          </button>
        ))}
      </nav>

      <div className="p-2">
        <button className="w-full flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
          <IconSettings size={20} />
        </button>
      </div>
    </div>
  )
}

export default Sidebar
