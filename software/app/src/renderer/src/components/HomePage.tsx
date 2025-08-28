import { Col, Row } from 'antd'
import { Content } from 'antd/es/layout/layout'
import CameraCard from './CameraCard'
import MotionCard from './MotionCard'

function HomePage(): React.JSX.Element {
  return (
    <Content>
      <Row style={{ height: '50%' }}>
        <Col flex={3}>
          <CameraCard />
        </Col>
        <Col flex={2}>
          <MotionCard />
        </Col>
      </Row>
      <Row style={{ height: '50%' }}>
        <Col flex={5}>
          <MotionCard />
        </Col>
        <Col flex={3}>
          <MotionCard />
        </Col>
      </Row>
    </Content>
  )
}

export default HomePage
