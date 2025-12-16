# Lógica de Conteo y Tags - Flow-Pack Compacta

## 1. Explicación Lógica del Contador (Para Defensa)
El contador de producción es **por evento**, no por tiempo ni velocidad. Esto garantiza que solo se cuenten productos realmente procesados.

**La secuencia lógica es:** 
1.  **Detección**: El sensor de producto (`I_Sensor_Prod`) detecta el paso de un alfajor.
2.  **Tracking**: El PLC registra la posición del alfajor (bit de registro o desplazamiento en shift register).
3.  **Ejecución**: Se activan las mordazas de sellado transversal (`Q_Motor_Cuch`).
4.  **Confirmación**: Al completarse el giro de la cuchilla (señal de leva o timer de ciclo seguro), se incrementa el contador.

> *“El contador de producción se incrementa únicamente cuando el sensor de producto detecta un alfajor y se completa correctamente el ciclo de sellado y corte, evitando errores por velocidad o conteo por tiempo.”*

---

## 2. Implementación en Ladder (SCL / Estructurado)

```scl
// Bloque: FC_Contador_Produccion
// Variables:
// - "I_Sensor_Prod" (Bool): Entrada física sensor óptico
// - "I_Maquina_Running" (Bool): Estado de marcha
// - "M_Ciclo_Completado" (Bool): Marca interna fin de corte
// - "DB_HMI".Cont_Produccion (DInt): Variable visualizada en HMI

// Detección de Flanco Positivo del Sensor
"R_Trig_Sensor"(CLK := "I_Sensor_Prod", Q => "M_Flanco_Sensor");

IF "M_Flanco_Sensor" AND "I_Maquina_Running" THEN
    // Iniciar seguimiento del producto
    "M_Producto_En_Proceso" := TRUE;
END_IF;

// Si hay producto y la cuchilla cortó (Simulado con timer o leva física)
IF "M_Producto_En_Proceso" AND "M_Ciclo_Completado" THEN
    // Incrementar Contador
    "DB_HMI".Cont_Produccion := "DB_HMI".Cont_Produccion + 1;
    
    // Resetear flag
    "M_Producto_En_Proceso" := FALSE;
END_IF;

// Reset desde HMI con contraseña
IF "DB_HMI".Cmd_Reset_Contador THEN
    "DB_HMI".Cont_Produccion := 0;
    "DB_HMI".Cmd_Reset_Contador := FALSE; // Auto-reset del comando
END_IF;
```

---

## 3. Tabla de Tags Actualizada (PLC Siemens S7-1200)

| Tag Name | Dirección | Tipo de Dato | Comentario |
| :--- | :--- | :--- | :--- |
| **Entradas (Inputs)** | | | |
| `I_Start` | %I0.0 | Bool | Pulsador NA Marcha |
| `I_Stop` | %I0.1 | Bool | Pulsador NC Parada |
| `I_Sensor_Prod` | %I0.2 | Bool | Sensor Fotoeléctrico (Detección alfajor) |
| `I_Sensor_Film` | %I0.3 | Bool | Sensor Marca de Color (Taco) |
| **Salidas (Outputs)** | | | |
| `Q_Cinta` | %Q0.0 | Bool | Motor Cinta Transportadora |
| `Q_Cuchilla` | %Q0.1 | Bool | Servo/Motor Corte |
| `Q_Calef_Long` | %Q0.2 | Bool | SSR Resistencias Longitudinales |
| `Q_Calef_Trans` | %Q0.3 | Bool | SSR Resistencias Transversales |
| **Bloque de Datos (DB_HMI)** | **DB10** | | **Comunicación con Panel KTP700** |
| `DB_HMI.Start_HMI` | DB10.DBX0.0 | Bool | Botón Start Pantalla |
| `DB_HMI.Stop_HMI` | DB10.DBX0.1 | Bool | Botón Stop Pantalla |
| `DB_HMI.Reset_Cmd` | DB10.DBX0.2 | Bool | Comando Reset General |
| `DB_HMI.Reset_Cont` | DB10.DBX0.3 | Bool | Comando Reset Contador (Protegido) |
| `DB_HMI.Temp_Long_Act` | DB10.DBD2 | Real | Temperatura Actual L. |
| `DB_HMI.Temp_Trans_Act`| DB10.DBD6 | Real | Temperatura Actual T. |
| `DB_HMI.Velocidad` | DB10.DBD10 | Real | Velocidad m/min |
| `DB_HMI.Cont_Produccion`| DB10.DBD14 | DInt | Contador de Alfajores (Retentivo) |

---

## 4. Texto para el Informe (Capítulo: Diseño HMI)

### 10.2 Diseño de Interfaz Hombre-Máquina (HMI)

Para la operación y supervisión de la envasadora Flow-Pack, se diseñó una interfaz gráfica intuitiva implementada en un panel táctil integrado al PLC (tipo Siemens KTP700 Basic). El diseño prioriza la seguridad, la claridad en la información y la facilidad de uso para operarios en planta.

**Estructura de Navegación:**
La navegación se estructura jerárquicamente partiendo de una **Pantalla de Inicio** de acceso restringido, que deriva a la **Pantalla Principal de Operación**. A diferencia de sistemas convencionales, el retorno a la pantalla principal desde menús de configuración (Parámetros, Mantenimiento) requiere una acción explícita del operario ("Volver"), evitando cambios de pantalla accidentales durante ajustes críticos.

**Funcionalidades Clave:**
1.  **Control de Producción Fiable:** El sistema de conteo de unidades envasadas (alfajores) se programó mediante lógica de eventos secuenciales (Detección Sensor + Confirmación de Corte), eliminando errores comunes de conteo por estimación de velocidad o tiempo de marcha.
2.  **Seguridad en Parámetros:** El acceso a la modificación de variables críticas del proceso (Temperaturas de sellado, Velocidad, Longitud de paquete) y al reseteo del contador de producción se encuentra protegido mediante contraseña de nivel supervisor.
3.  **Gestión de Alarmas:** El sistema monitorea en tiempo real fallos críticos (Falta de film, Emergencia, Fallos térmicos), deteniendo la máquina automáticamente y mostrando diagnósticos claros en color rojo para agilizar el mantenimiento.

Esta interfaz cumple con los estándares de la industria alimentaria, proporcionando una operación robusta y minimizando el error humano.
