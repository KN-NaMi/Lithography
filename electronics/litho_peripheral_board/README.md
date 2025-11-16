# litho_peripheral_board

This repository contains the design files and documentation for a custom peripheral control board centered around an **STM32G474 Core Board**. The board is designed to interface with external systems, manage sensors via I2C, and control a 12V pump, while communicating essential data using a **JETSON-formatted protocol** over **UART**.

---

## 🚀 Features

* **Microcontroller:** Utilizes an **STM32G474** (or similar pin-compatible core board) for powerful and efficient control.
* **JETSON Communication:** Dedicated UART interface (`USART_TX`/`USART_RX`) for reliable data exchange, intended for **JETSON-based data packets**.
* **Outside Signal Monitoring:** Input circuit with a **3.3V pull-up** and **LED indicator (D3)** to monitor an external signal (S1).
* **I2C Sensor Interface:** Standard I2C header (J4) for connecting and reading various sensors.
* **Pump Control:** High-side switch **(P-channel MOSFET, Q1)** driven by a PWM signal (`PWM_T_CH1`) for precise **12V pump control** (`pompa_GND`). Includes a flyback diode (D2) for protection.
* **Power Management:**
    * **12V Input:** Fused (`F1`) input for the pump and LDO regulator.
    * **3.3V Regulation:** On-board **LM39100S-3.3 LDO regulator (U1)** converts the 12V supply to a stable **3.3V** for the MCU and logic.

---

## 🧰 Hardware Overview

The board is logically divided into several functional blocks:

### 1. MCU Core
* **MCU:** STM32G474 CoreBoard.
* **Power:** Powered by the regulated **+3.3V** supply.

### 2. JETSON Communication (UART)
* **Connector (J3):** Standard 4-pin header for **UART** connection.
* **Signals:** `USART_TX`, `USART_RX`, `+3.3V`, and `GND`. This is the primary interface for sending/receiving JETSON data.

### 3. Outside Signal
* **Input (S1):** Simple header for connecting an external digital signal.
* **Signal Path:** The input is monitored by a general-purpose I/O pin on the MCU.

### 4. I2C Sensor
* **Connector (J4):** 4-pin header for the I2C bus.
* **Signals:** `SCL_I2C1` and `SDA_I2C1` connect directly to the MCU.

### 5. Pump Control and Power
* **Pump Power (J2):** Fused 12V input with a flyback diode.
* **Pump Control Circuit:** Uses a **PWM signal** from the MCU (`PWM_T_CH1`) to drive a MOSFET (Q1), effectively controlling the power to the pump (`pompa_GND`).
* **LDO Regulator (U1):** Provides the necessary **3.3V** operational voltage.

---

## 🛠️ Usage Notes

### Software
* The **STM32 firmware** must be developed to handle the following:
    * Parsing incoming **JETSON** messages from the `USART_RX` line.
    * Formatting and sending **JETSON** responses on the `USART_TX` line.
    * Reading data from connected **I2C sensors**.
    * Generating the **PWM signal** on the designated pin (e.g., `PB14` or equivalent) to control the pump speed/status.
    * Monitoring the **Outside Signal** input.

### Power
* Ensure the external power supply is **12V DC** and connected correctly to the **J2** header.
* The maximum current draw for the pump should be considered with respect to the fuse (`F1`) rating and the MOSFET (`Q1`) specifications.

---

## 📝 Design Files
The full schematic and PCB layout files are available in the repository.
* **File Name:** `litho_peripheral_board.kicad_sch` (KiCad E.D.A. 5.0.5)