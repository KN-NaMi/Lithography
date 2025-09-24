import { Card, CardContent } from '@renderer/components/ui/card'
import CameraCard from './camera-card'

function DashboardPage(): React.JSX.Element {
  return (
    <div className="p-6 h-ful">
      <h1 className="text-2xl font-semibold text-white mb-6">Dashboard</h1>

      <div className="grid h-[calc(100vh-140px)] grid-cols-1 md:grid-cols-2 auto-rows-fr gap-6">
        <Card>
          <CardContent>
            <CameraCard />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-gray-300">Motion content</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-gray-300">Mask content</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-gray-300">Projector content</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
