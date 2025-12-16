# Mapeo de Tags PLC - Envasadora Flow-Pack Compacta
# Basado en HMI Siemens S7-1200

## Entradas Digitales (Digital Inputs - DI)
| Tag | Dirección | Descripción |
|-----|-----------|-------------| 
| I_Start_Btn | %I0.0 | Pulsador Físico START |
| I_Stop_Btn | %I0.1 | Pulsador Físico STOP (NC) |
| I_Emergencia | %I0.2 | Seta de Emergencia (NC) |
| I_Sensor_Prod | %I0.3 | Sensor presencia de producto (Fotoeléctrico) |
| I_Sensor_Film | %I0.4 | Sensor marca de registro (Taco) |
| I_Guarda_Aberta | %I0.5 | Sensor seguridad guardas |
| I_Termico_Cinta | %I0.6 | Relé térmico motor cinta |
| I_Termico_Cuch | %I0.7 | Relé térmico motor cuchilla |

## Salidas Digitales (Digital Outputs - DQ)
| Tag | Dirección | Descripción |
|-----|-----------|-------------|
| Q_Motor_Cinta | %Q0.0 | Contactor Motor Cinta Transportadora |
| Q_Motor_Film | %Q0.1 | Contactor Motor Arrastre Film |
| Q_Motor_Cuch | %Q0.2 | Servo/Motor Cuchilla Transversal |
| Q_SSR_Long | %Q0.3 | Relé Estado Sólido Resistencias Longitudinales |
| Q_SSR_Trans | %Q0.4 | Relé Estado Sólido Resistencias Transversales |
| Q_Luz_Verde | %Q0.5 | Baliza Verde (Marcha) |
| Q_Luz_Roja | %Q0.6 | Baliza Roja (Parada/Alarma) |
| Q_Sirena | %Q0.7 | Alarma Sonora |

## Entradas Analógicas (Analog Inputs - AI)
| Tag | Dirección | Descripción |
|-----|-----------|-------------|
| IW_Temp_Long | %IW64 | Termocupla J/K Sellado Longitudinal (Scaled) |
| IW_Temp_Trans | %IW66 | Termocupla J/K Sellado Transversal (Scaled) |

## Bloques de Datos (Data Blocks - DB) - Interfaz HMI
### DB_HMI_Control (Escritura desde HMI)
| Variable | Tipo | Offset | Descripción |
|----------|------|--------|-------------|
| HMI_Start | Bool | 0.0 | Botón Start HMI |
| HMI_Stop | Bool | 0.1 | Botón Stop HMI |
| HMI_Reset | Bool | 0.2 | Botón Reset HMI |
| HMI_Man_Cinta | Bool | 0.3 | Manual Cinta ON/OFF |
| HMI_Man_Film | Bool | 0.4 | Manual Film ON/OFF |
| HMI_Man_Cuch | Bool | 0.5 | Manual Cuchilla (Jog) |

### DB_HMI_Params (Setpoints)
| Variable | Tipo | Offset | Descripción |
|----------|------|--------|-------------|
| SP_Temp_Long | Real | 0.0 | Setpoint Temp. Longitudinal |
| SP_Temp_Trans | Real | 4.0 | Setpoint Temp. Transversal |
| SP_Velocidad | Int | 8.0 | Setpoint Velocidad (m/min) |
| SP_Largo_Paq | Real | 10.0 | Setpoint Largo Paquete (mm) |
| SP_Retardo_Cuch | Int | 14.0 | Retardo corte (ms) |

### DB_HMI_Status (Lectura en HMI)
| Variable | Tipo | Offset | Descripción |
|----------|------|--------|-------------|
| Act_Temp_Long | Real | 0.0 | Temperatura Actual Long. |
| Act_Temp_Trans | Real | 4.0 | Temperatura Actual Trans. |
| Act_Velocidad | Real | 8.0 | Velocidad Real |
| Cont_Produccion | DInt | 12.0 | Contador de Alfajores |
| Estado_Maquina | Int | 16.0 | 0=Stop, 1=Run, 2=Error |
| Alarm_Code | Word | 18.0 | Bitmask de alarmas activas |
