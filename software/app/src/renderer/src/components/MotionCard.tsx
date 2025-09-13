"use client"

import type React from "react"
import { useState } from "react"
import { Button, Input, Select, Card, InputNumber } from "antd"
import { HomeOutlined, UpOutlined, DownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons"

const { Option } = Select

function MotionCard(): React.JSX.Element {
  const [currentX, setCurrentX] = useState(50.0)
  const [currentY, setCurrentY] = useState(25.5)
  const [gCommand, setGCommand] = useState("")
  const [units, setUnits] = useState("mm")
  const [stepValue, setStepValue] = useState(10)

  const buttonStyle = {
    width: "100%",
    height: "100%",
    minHeight: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const smallButtonStyle = {
    ...buttonStyle,
    width: "80%",
    height: "80%",
    margin: "10%",
  }

  const homeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#000",
    borderColor: "#000",
    color: "#fff",
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "12px",
          minHeight: 0,
        }}
      >
        {/* Motion Control Grid */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "1",
              width: "60%",
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gridTemplateRows: "repeat(5, 1fr)",
              gap: "4px",
              padding: "8px",
            }}
          >
            {/* Up Large */}
            <div style={{ gridColumn: "3", gridRow: "1" }}>
              <Button style={smallButtonStyle} icon={<UpOutlined />} aria-label="Move Up Large" />
            </div>

            {/* Up Small */}
            <div style={{ gridColumn: "3", gridRow: "2" }}>
              <Button style={buttonStyle} icon={<UpOutlined />} aria-label="Move Up Small" />
            </div>

            {/* Left Large */}
            <div style={{ gridColumn: "1", gridRow: "3" }}>
              <Button style={smallButtonStyle} icon={<LeftOutlined />} aria-label="Move Left Large" />
            </div>

            {/* Left Small */}
            <div style={{ gridColumn: "2", gridRow: "3" }}>
              <Button style={buttonStyle} icon={<LeftOutlined />} aria-label="Move Left Small" />
            </div>

            {/* Home Button */}
            <div style={{ gridColumn: "3", gridRow: "3" }}>
              <Button style={homeButtonStyle} icon={<HomeOutlined />} aria-label="Home Position" />
            </div>

            {/* Right Small */}
            <div style={{ gridColumn: "4", gridRow: "3" }}>
              <Button style={buttonStyle} icon={<RightOutlined />} aria-label="Move Right Small" />
            </div>

            {/* Right Large */}
            <div style={{ gridColumn: "5", gridRow: "3" }}>
              <Button style={smallButtonStyle} icon={<RightOutlined />} aria-label="Move Right Large" />
            </div>

            {/* Down Small */}
            <div style={{ gridColumn: "3", gridRow: "4" }}>
              <Button style={buttonStyle} icon={<DownOutlined />} aria-label="Move Down Small" />
            </div>

            {/* Down Large */}
            <div style={{ gridColumn: "3", gridRow: "5" }}>
              <Button style={smallButtonStyle} icon={<DownOutlined />} aria-label="Move Down Large" />
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div
          style={{
            width: "128px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          <Card size="small" style={{ padding: "8px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: 500 }}>Step</span>
                <InputNumber
                  value={stepValue}
                  onChange={(value) => setStepValue(value || 0)}
                  step={0.1}
                  min={0.1}
                  size="small"
                  style={{ width: "80px", textAlign: "center" }}
                />
              </div>
              <div
                style={{
                  width: "32px",
                  height: "1px",
                  backgroundColor: "#d9d9d9",
                }}
              ></div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: 500 }}>Units</span>
                <Select value={units} onChange={setUnits} size="small" style={{ width: "80px" }}>
                  <Option value="mm">mm</Option>
                  <Option value="inch">in</Option>
                  <Option value="steps">steps</Option>
                </Select>
              </div>
            </div>
          </Card>

          <Card size="small" style={{ padding: "8px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: 500 }}>G-Code</span>
              <Input
                value={gCommand}
                onChange={(e) => setGCommand(e.target.value)}
                placeholder="G01 X10"
                size="small"
                style={{
                  width: "100%",
                  fontFamily: "monospace",
                  textAlign: "center",
                }}
              />
              <Button type="primary" size="small" style={{ width: "100%" }}>
                Send
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "4px",
          left: "8px",
          fontSize: "12px",
          color: "#8c8c8c",
          fontFamily: "monospace",
        }}
      >
        X: {currentX.toFixed(1)} Y: {currentY.toFixed(1)}
      </div>
    </div>
  )
}

export default MotionCard
