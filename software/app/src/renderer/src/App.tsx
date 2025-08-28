import { Layout, ConfigProvider } from 'antd'
import React from 'react'
import SideBar from './components/SideBar'
import HomePage from './components/HomePage'

function App(): React.JSX.Element {
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg: '#081F3E'
          },
          Menu: {
            itemSelectedBg: '#0E2C54',
            itemSelectedColor: '#FFFFFF',
            itemColor: '#CFCFCF',
            itemBg: '#081F3E',
            itemHoverColor: '#FFFFFF'
          }
        }
      }}
    >
      <div
        style={{
          height: '100vh',
          margin: 0,
          padding: 0,
          overflow: 'hidden'
        }}
      >
        <Layout
          style={{
            height: '100vh',
            margin: 0,
            padding: 0
          }}
        >
          <SideBar />
          <HomePage />
        </Layout>
      </div>
    </ConfigProvider>
  )
}

export default App
