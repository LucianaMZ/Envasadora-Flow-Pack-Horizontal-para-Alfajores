# Escenarios Hipotéticos de Alarmas y Fallas
## Envasadora Flow-Pack Compacta - Proyecto Final 

Este documento detalla los casos hipotéticos de fallas simulados en el HMI, explicando la causa física, la detección por parte del PLC y la respuesta del sistema.

### 1. Falta de Film / Papel
*   **Causa Hipotética:** La bobina de film plástico se ha terminado o se ha cortado la alimentación del material de empaque.
*   **Detección (PLC):** Sensor inductivo o fotoeléctrico ubicado en el portabobinas detecta ausencia de material por más de 2 segundos mientras el motor de arrastre está activo.
*   **Respuesta HMI:**
    *   **Mensaje:** `Falta de film/papel`
    *   **Estado:** DETENCIÓN INMEDIATA (Stop)
    *   **Acción Operador:** Colocar nueva bobina y Resetear alarma.

### 2. Producto Mal Posicionado
*   **Causa Hipotética:** Un alfajor no ingresó correctamente al tubo formador o se desplazó en la cinta de entrada, bloqueando el paso o quedando fuera de fase.
*   **Detección (PLC):** Sensor de barrera (fotocélula) a la entrada de las mordazas detecta objeto en el momento incorrecto del ciclo (desincronización).
*   **Respuesta HMI:**
    *   **Mensaje:** `Producto mal posicionado (sensor de barrera)`
    *   **Estado:** PARADA DE EMERGENCIA (Para evitar aplastamiento)
    *   **Acción Operador:** Retirar producto manualmente, ajustar guías y Resetear.

### 3. Falla en Mordazas de Corte
*   **Causa Hipotética:** El servomotor o motor paso a paso de las mordazas transversales se ha trabado o no alcanza la posición de "Home" en el tiempo esperado.
*   **Detección (PLC):** Falta de señal del encoder o sensor de "Home" de las mordazas tras completar el ciclo de corte.
*   **Respuesta HMI:**
    *   **Mensaje:** `Falla en mordazas de corte`
    *   **Estado:** FALLA CRÍTICA
    *   **Acción Operador:** Verificar obstrucción mecánica, revisar servodrive y Resetear.

### 4. Sobretemperatura en Selladores
*   **Causa Hipotética:** Falla en el relé de estado sólido (SSR) que queda pegado, o error en el termopar, provocando que la resistencia caliente sin control.
*   **Detección (PLC):** La entrada analógica del termopar registra un valor superior al límite de seguridad (ej. > 180°C) o muy por encima del Setpoint.
*   **Respuesta HMI:**
    *   **Mensaje:** `Sobretemperatura en selladores`
    *   **Estado:** ALARMA CRÍTICA (Corte de energía a resistencias)
    *   **Acción Operador:** Apagar máquina, revisar SSR/Termopar.

### 5. Parada de Emergencia
*   **Causa Hipotética:** El operario ha pulsado el botón físico de "Golpe de Puño" por una situación de riesgo.
*   **Detección (PLC):** Entrada digital I0.0 (Stop Emergencia) se desactiva (lógica NC - Normal Cerrado se abre).
*   **Respuesta HMI:**
    *   **Mensaje:** `Parada de emergencia activada`
    *   **Estado:** BLOQUEO TOTAL
    *   **Acción Operador:** Liberar botón de emergencia y Resetear desde HMI.

### 6. Falla en Variador de Frecuencia
*   **Causa Hipotética:** El variador que controla la cinta transportadora reporta un error (sobrecorriente, sobretensión) o no responde.
*   **Detección (PLC):** Entrada digital de "Falla Variador" activa o falta de señal "Ready" del variador.
*   **Respuesta HMI:**
    *   **Mensaje:** `Falla en variador de frecuencia`
    *   **Estado:** DETENCIÓN
    *   **Acción Operador:** Verificar panel del variador, revisar motor y Resetear.
