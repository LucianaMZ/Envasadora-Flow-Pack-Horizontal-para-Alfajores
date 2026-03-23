# 📦 Envasadora Flow-Pack Horizontal (PLC + HMI)

## 📌 Descripción del Proyecto

Este proyecto presenta el desarrollo teórico de una **máquina envasadora Flow-Pack horizontal**, diseñada para el empaquetado individual de alfajores.

El sistema está basado en el modelo industrial **Multipack NT-50**, adaptado para su automatización mediante un **PLC Siemens S7-1200** y una **interfaz HMI táctil**, integrando conceptos de automatización industrial, control de procesos y diseño mecánico.

---

## 🎯 Objetivos

### Objetivo General

Diseñar un sistema automatizado de envasado tipo Flow-Pack controlado por PLC, capaz de operar de forma eficiente y segura.

### Objetivos Específicos

* Analizar máquinas industriales existentes
* Diseñar la arquitectura mecánica y funcional
* Definir entradas y salidas del sistema
* Desarrollar la lógica de control en PLC (FBD)
* Diseñar la interfaz HMI
* Elaborar lista de materiales (BOM)
* Definir plan de pruebas y puesta en marcha

---

## ⚙️ Tecnologías Utilizadas

* PLC Siemens S7-1200 (CPU 1214C)
* Programación en TIA Portal (FBD)
* HMI táctil (KTP400 / Weintek)
* Sensores fotoeléctricos
* Control PID de temperatura
* Motores eléctricos y drivers
* Sistemas de sellado térmico

---

## 🧠 Funcionamiento General

El sistema realiza el envasado continuo mediante las siguientes etapas:

1. Alimentación del producto mediante cinta transportadora
2. Formación del film en forma de tubo
3. Sellado longitudinal del envase
4. Sellado transversal y corte
5. Salida del producto empaquetado

Todo el proceso se encuentra sincronizado y controlado automáticamente por el PLC.

---

## 🧩 Arquitectura del Sistema

### Módulos Principales

* Cinta de alimentación
* Porta-film
* Formador de tubo
* Sistema de tracción de film
* Sellado longitudinal
* Sellado transversal y corte
* Sistema de control (PLC + HMI)

---

## 🔌 Entradas y Salidas (I/O)

### Entradas Digitales

* Start / Stop
* Parada de emergencia (E-Stop)
* Sensor de producto
* Sensor de registro
* Fin de film
* Sensores de seguridad

### Entradas Analógicas

* Temperatura (termopar 4-20 mA)

### Salidas Digitales

* Motores (cinta, film, corte)
* Activación de resistencias (SSR)
* Señalización (LEDs)
* Sistema de rechazo

---

## 🔄 Secuencia de Operación

El sistema sigue una lógica tipo **Grafcet**:

* Espera
* Alimentación
* Posicionamiento
* Sellado longitudinal
* Corte
* Salida del producto

Incluye condiciones de seguridad como parada de emergencia y protección por falta de material.

---

## 💻 Programación del PLC

La lógica se desarrolla en **Diagramas de Bloques (FBD)** en TIA Portal, utilizando:

* Bloques de función (FB/FC)
* Temporizadores (TON)
* Estructura modular
* Base de datos de parámetros (DB)

### Bloques Principales

* `FB_Process`: control secuencial
* `FB_MotorControl`: control de motores
* `FB_StepperControl`: control de tracción
* `FB_PID_Interface`: control de temperatura
* `FC_Alarms`: gestión de alarmas

---

## 🖥️ Interfaz HMI

Pantallas diseñadas:

* Principal (operación)
* Parámetros
* Alarmas
* Modo manual
* Diagnóstico

Permite:

* Control del sistema
* Visualización de variables
* Ajuste de parámetros

---

## 📦 Lista de Materiales (BOM)

Incluye componentes principales como:

* Estructura de acero inoxidable
* Motores y drivers
* PLC y HMI
* Sensores fotoeléctricos
* Sistema de sellado térmico
* Fuente de alimentación

---

## 🧪 Plan de Pruebas

Etapas de validación:

1. Prueba en vacío
2. Prueba con film
3. Ajuste de temperatura (PID)
4. Prueba con producto
5. Validación final

**Criterio de aceptación:**
≥ 95% de paquetes sin defectos

---

## 🛡️ Seguridad

* Parada de emergencia con relé de seguridad
* Guardas interbloqueadas
* Protecciones eléctricas
* Puesta a tierra
* Cumplimiento de normas industriales

---

## 📊 Resultados Esperados

* Funcionamiento automatizado continuo
* Alta eficiencia en el empaquetado
* Control preciso de temperatura y sincronización
* Sistema adaptable y escalable

---

## 🧾 Conclusiones

El proyecto demuestra la integración de múltiples disciplinas de la automatización industrial, combinando diseño mecánico, control lógico programable y supervisión mediante HMI.

Se logra una solución completa que simula el funcionamiento de una máquina industrial real, aplicando estándares y buenas prácticas del sector.

---

## 👩‍💻 Autora

**Luciana Mariel Zapana**
Tecnicatura Universitaria en Automatización y Robótica

---

## 📚 Año

2025
