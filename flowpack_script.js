// State Variables
let machineState = 'STOPPED'; // STOPPED, RUNNING, ALARM
let currentScreen = 'screen-start'; 
let productionCount = 0;
let simulationInterval = null;

// Counter Logic State
let productSensorActive = false;
let cycleComplete = false;
let cycleTimer = null; 

// Password Protection
let pendingTargetScreen = null;
let pendingAction = null;
const SUPERVISOR_PASS = "1234";

// Parameters (Setpoints)
let params = {
    tempLong: 120,
    tempTrans: 130,
    speed: 15,
    length: 100,
    delay: 50
};

// Current Values (Process Variables)
let currentValues = {
    tempLong: 25.0,
    tempTrans: 25.0,
    speed: 0
};

// Alarms
let activeAlarms = [];
let nextAutoAlarmCount = -1; // Trigger for automatic simulation
const POSSIBLE_ALARMS = [
    'Falta de film/papel',
    'Producto mal posicionado',
    'Sobretemperatura en selladores',
    'Falla en variador de frecuencia',
    'Falla en mordazas de corte'
];

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Initial render
    updateValuesDisplay();
    updateParamInputs();
    
    // Schedule first random alarm (Before 20 products)
    scheduleRandomAlarm();
    
    // Simulate sensor inputs for Manual Screen
    simulateSensors();
});

// Navigation
function navigateTo(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    // Handle Header visibility (Visible everywhere except Start)
    const header = document.getElementById('main-header');
    if (screenId === 'screen-start') {
        header.style.display = 'none';
    } else {
        header.style.display = 'flex';
    }
}



// Date Time
function updateDateTime() {
    const now = new Date();
    const formatted = now.toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
    
    const headerDt = document.getElementById('header-datetime');
    const startDt = document.getElementById('start-datetime');
    
    if (headerDt) headerDt.textContent = formatted;
    if (startDt) startDt.textContent = formatted;
}

// Machine Control
function startMachine() {
    if (activeAlarms.length > 0) {
        alert("No se puede iniciar con alarmas activas.");
        return;
    }
    
    machineState = 'RUNNING';
    updateStatusIndicator();
    
    // Start animation
    document.querySelector('.process-graphic').classList.add('anim-running');
    
    // Start Simulation Loop
    if (simulationInterval) clearInterval(simulationInterval);
    simulationInterval = setInterval(simulationLoop, 100); // Faster loop for smoother sensor logic
}

function stopMachine() {
    machineState = 'STOPPED';
    updateStatusIndicator();
    
    // Stop animation
    document.querySelector('.process-graphic').classList.remove('anim-running');
    
    // Stop Simulation Loop
    currentValues.speed = 0;
    updateValuesDisplay();
    
    // Reset cycle logic
    productSensorActive = false;
    cycleComplete = false;
    clearTimeout(cycleTimer);
    document.getElementById('vis-sensor-prod').classList.remove('active');
}

function resetMachine() {
    if (machineState === 'STOPPED') {
        // Reset manual toggles
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.classList.remove('active');
            btn.textContent = 'OFF';
        });
        alert("Máquina reseteada y lista.");
    }
}

function resetCounter() {
    productionCount = 0;
    document.getElementById('val-production').textContent = productionCount;
    scheduleRandomAlarm(); // New batch, new random alarm schedule
    alert("Contador reseteado. Nueva simulación iniciada.");
}

function scheduleRandomAlarm() {
    // Alarm will happen between product 2 and 18 (guaranteed before 20)
    nextAutoAlarmCount = Math.floor(Math.random() * 16) + 2;
    console.log("Simulación: Próxima alarma programada en contador =", nextAutoAlarmCount);
}

function updateStatusIndicator() {
    const ind = document.getElementById('header-status-indicator');
    const text = document.getElementById('header-status-text');
    
    ind.className = 'machine-status-indicator'; // reset
    
    if (machineState === 'RUNNING') {
        ind.classList.add('running');
        text.textContent = 'EN MARCHA';
        
        document.getElementById('lamp-run').querySelector('.lamp-circle').classList.add('on');
        document.getElementById('lamp-stop').querySelector('.lamp-circle').classList.remove('on');
        document.getElementById('lamp-alarm').querySelector('.lamp-circle').classList.remove('on');
        
    } else if (machineState === 'ALARM') {
        ind.style.backgroundColor = 'red'; 
        text.textContent = 'ALARMA';
        
        document.getElementById('lamp-run').querySelector('.lamp-circle').classList.remove('on');
        document.getElementById('lamp-stop').querySelector('.lamp-circle').classList.remove('on'); // Usually stop is also on or off depending on logic, let's say Alarm lamp dominates
        document.getElementById('lamp-alarm').querySelector('.lamp-circle').classList.add('on');
        
    } else {
        text.textContent = 'DETENIDA';
        
        document.getElementById('lamp-run').querySelector('.lamp-circle').classList.remove('on');
        document.getElementById('lamp-stop').querySelector('.lamp-circle').classList.add('on');
        document.getElementById('lamp-alarm').querySelector('.lamp-circle').classList.remove('on');
    }
}

// Simulation Loop & Logic
function simulationLoop() {
    if (machineState !== 'RUNNING') return;
    
    // 1. Simulate Values approaching Setpoints
    let diffL = params.tempLong - currentValues.tempLong;
    currentValues.tempLong += diffL * 0.05 + (Math.random() - 0.5) * 0.5;
    
    let diffT = params.tempTrans - currentValues.tempTrans;
    currentValues.tempTrans += diffT * 0.05 + (Math.random() - 0.5) * 0.5;
    
    currentValues.speed = params.speed;
    updateValuesDisplay();
    
    // 2. Event-Based Counter Logic Simulation
    // Randomly trigger product arrival if not already processing
    if (!productSensorActive && !cycleComplete && Math.random() < 0.02) { 
        triggerProductSensor();
    }
    
    // 3. Random Alarm Generation (Disabled for Controlled Demo)
    // if (Math.random() < 0.0005) { 
    //     triggerAlarm("Falta de film");
    // }
    
    // 3. Automatic Alarm Simulation (Before 20 items)
    if (nextAutoAlarmCount > 0 && productionCount >= nextAutoAlarmCount) {
        // Trigger a random alarm from the list
        const randomMsg = POSSIBLE_ALARMS[Math.floor(Math.random() * POSSIBLE_ALARMS.length)];
        triggerAlarm(randomMsg);
        nextAutoAlarmCount = -1; // Disable until next reset
    }
}

function triggerProductSensor() {
    // Sensor detects product
    productSensorActive = true;
    document.getElementById('vis-sensor-prod').classList.add('active'); // Visual feedback
    
    // Simulate "Cycle" (Time it takes to reach jaws and cut)
    // In real PLC: Wait for Encoder Count or Time
    const cycleTime = 2000; // 2 seconds to reach cutter
    
    cycleTimer = setTimeout(() => {
        completeCycle();
    }, cycleTime);
}

function completeCycle() {
    // Cycle Complete: Sealing and Cutting done
    if (machineState === 'RUNNING') {
        productionCount++;
        document.getElementById('val-production').textContent = productionCount;
        
        // Reset flags for next product
        productSensorActive = false;
        document.getElementById('vis-sensor-prod').classList.remove('active');
    }
}

function updateValuesDisplay() {
    document.getElementById('val-temp-long').textContent = currentValues.tempLong.toFixed(1);
    document.getElementById('val-temp-trans').textContent = currentValues.tempTrans.toFixed(1);
    document.getElementById('val-speed').textContent = currentValues.speed;
}

// -------------------------------------------------------------------------
// PARAMETERS LOGIC
// -------------------------------------------------------------------------

function adjustParam(id, delta) {
    const input = document.getElementById(id);
    let val = parseFloat(input.value);
    let min = parseFloat(input.min);
    let max = parseFloat(input.max);
    
    val += delta;
    if (val < min) val = min;
    if (val > max) val = max;
    
    input.value = val;
}

function saveParams() {
    // Save inputs to params object
    params.tempLong = parseFloat(document.getElementById('set-temp-long').value);
    params.tempTrans = parseFloat(document.getElementById('set-temp-trans').value);
    params.speed = parseFloat(document.getElementById('set-speed').value);
    params.length = parseFloat(document.getElementById('set-length').value);
    params.delay = parseFloat(document.getElementById('set-delay').value);
    
    alert("Parámetros guardados correctamente.");
}

function updateParamInputs() {
    document.getElementById('set-temp-long').value = params.tempLong;
    document.getElementById('set-temp-trans').value = params.tempTrans;
    document.getElementById('set-speed').value = params.speed;
    document.getElementById('set-length').value = params.length;
    document.getElementById('set-delay').value = params.delay;
}

// Alarms
function triggerAlarm(msg) {
    if (activeAlarms.includes(msg)) return;
    
    activeAlarms.push(msg);
    stopMachine();
    machineState = 'ALARM';
    updateStatusIndicator();
    
    // Add to list
    const list = document.getElementById('alarms-list');
    const item = document.createElement('div');
    
    // Determine severity class based on message
    let severityClass = 'warning';
    if (msg.includes('Sobretemperatura') || msg.includes('Parada de emergencia') || msg.includes('Falla')) {
        severityClass = 'critical';
    }
    
    item.className = `alarm-item ${severityClass}`;
    item.innerHTML = `<span class="alarm-time">${new Date().toLocaleTimeString()}</span> <span class="alarm-msg">${msg}</span>`;
    list.prepend(item);
    
    alert("ALARMA ACTIVA: " + msg);
}

function resetAlarms() {
    activeAlarms = [];
    document.getElementById('alarms-list').innerHTML = '';
    machineState = 'STOPPED';
    updateStatusIndicator();
}

// Manual Mode
function toggleManual(id) {
    const btn = document.getElementById(id);
    if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        btn.textContent = 'OFF';
    } else {
        btn.classList.add('active');
        if (id === 'man-knife') btn.textContent = 'ACTIVO';
        else btn.textContent = 'ON';
    }
}

function simulateSensors() {
    setInterval(() => {
        // Toggle sensor lights randomly to show activity simulation
        const sensors = ['sens-product', 'sens-film', 'sens-limit'];
        sensors.forEach(s => {
            const el = document.getElementById(s);
            if (el) {
                if (Math.random() > 0.5) el.classList.add('on');
                else el.classList.remove('on');
            }
        });
    }, 2000);
}
