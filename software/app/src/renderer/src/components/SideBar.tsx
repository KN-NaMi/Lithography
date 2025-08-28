import { Button, Menu, Layout } from 'antd'
import { HomeOutlined, SettingOutlined } from '@ant-design/icons'

function SideBar(): React.JSX.Element {
  return (
    <Layout.Sider width={100} collapsed={true}>
      <Menu
        mode="inline"
        style={{
          height: 'calc(100% - 50px)',
          borderRight: 0,
          padding: 10,
          display: 'flex'
        }}
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <HomeOutlined />,
            label: 'Home'
          }
        ]}
      />
      <Button
        type="text"
        icon={<SettingOutlined />}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          margin: '0 auto',
          color: '#CFCFCF',
          fontSize: 18
        }}
      />
    </Layout.Sider>
  )
}

export default SideBar
