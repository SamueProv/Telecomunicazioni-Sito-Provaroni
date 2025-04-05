// Ohm's Law Calculator
function calculateOhmsLaw() {
    const voltage = parseFloat(document.getElementById('voltage').value);
    const current = parseFloat(document.getElementById('current').value);
    const resistance = parseFloat(document.getElementById('resistance').value);
    const resultElement = document.getElementById('ohms-law-result');

    // Calculate missing value
    if (isNaN(voltage) && !isNaN(current) && !isNaN(resistance)) {
        const calculatedVoltage = current * resistance;
        document.getElementById('voltage').value = calculatedVoltage.toFixed(2);
        resultElement.textContent = `V = I × R = ${current} × ${resistance} = ${calculatedVoltage.toFixed(2)} V`;
    } 
    else if (!isNaN(voltage) && isNaN(current) && !isNaN(resistance)) {
        const calculatedCurrent = voltage / resistance;
        document.getElementById('current').value = calculatedCurrent.toFixed(2);
        resultElement.textContent = `I = V / R = ${voltage} / ${resistance} = ${calculatedCurrent.toFixed(2)} A`;
    }
    else if (!isNaN(voltage) && !isNaN(current) && isNaN(resistance)) {
        const calculatedResistance = voltage / current;
        document.getElementById('resistance').value = calculatedResistance.toFixed(2);
        resultElement.textContent = `R = V / I = ${voltage} / ${current} = ${calculatedResistance.toFixed(2)} Ω`;
    }
    else {
        resultElement.textContent = "Inserisci due valori per calcolare il terzo";
    }
}

// Reset form
function resetCalculator(formId) {
    document.getElementById(formId).reset();
    const resultElements = document.querySelectorAll('.calculator-result');
    resultElements.forEach(element => {
        element.textContent = '';
    });
}

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.toggle('dark-mode');
    });
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Initialize dark mode from localStorage
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('dark-mode');
    });
}

// Tooltip initialization
document.addEventListener('DOMContentLoaded', function() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltipElement = document.createElement('div');
            tooltipElement.className = 'tooltip-bubble';
            tooltipElement.textContent = tooltipText;
            document.body.appendChild(tooltipElement);
            
            const rect = this.getBoundingClientRect();
            tooltipElement.style.position = 'absolute';
            tooltipElement.style.left = `${rect.left + rect.width/2 - tooltipElement.offsetWidth/2}px`;
            tooltipElement.style.top = `${rect.top - tooltipElement.offsetHeight - 10}px`;
            
            this.tooltipElement = tooltipElement;
        });
        
        tooltip.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
            }
        });
    });
});

// Navigation active link highlighting
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.classList.remove('hover:text-blue-200');
            link.classList.add('text-blue-300');
        }
    });
});

// Karnaugh Map Generator Functions
function generateKMap() {
    const input = document.getElementById('truthInput').value.trim();
    const errorElement = document.getElementById('inputError');
    const kmapContainer = document.getElementById('kmapContainer');
    
    // Validate input
    if (!input) {
        showError(errorElement, "Per favore inserisci dei valori");
        return;
    }

    const values = input.split(',').map(v => v.trim());
    if (values.length < 8 || values.length > 16 || !isPowerOfTwo(values.length)) {
        showError(errorElement, "Inserisci 8, 16 valori (potenze di 2)");
        return;
    }

    if (!values.every(v => v === '0' || v === '1')) {
        showError(errorElement, "Solo valori 0 e 1 permessi");
        return;
    }

    // Clear any previous errors
    hideError(errorElement);

    // Generate K-Map
    const numVars = Math.log2(values.length);
    const kmapTable = document.getElementById('kmapTable');
    kmapTable.innerHTML = generateKMapHTML(values, numVars);
    
    // Simplify expression
    const simplifiedExpr = simplifyExpression(values, numVars);
    document.getElementById('simplifiedExpr').textContent = simplifiedExpr;
    
    // Show results
    kmapContainer.classList.remove('hidden');
}

function clearInput() {
    document.getElementById('truthInput').value = '';
    document.getElementById('kmapContainer').classList.add('hidden');
    hideError(document.getElementById('inputError'));
}

function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

function hideError(element) {
    element.textContent = '';
    element.classList.add('hidden');
}

function isPowerOfTwo(n) {
    return n && (n & (n - 1)) === 0;
}

function generateKMapHTML(values, numVars) {
    let html = '<table class="border-collapse border border-gray-300">';
    
    // Generate table headers based on number of variables
    if (numVars === 3) {
        html += `
            <thead>
                <tr>
                    <th class="border border-gray-300 p-2 bg-gray-100"></th>
                    <th class="border border-gray-300 p-2 bg-gray-100">A'B'</th>
                    <th class="border border-gray-300 p-2 bg-gray-100">A'B</th>
                    <th class="border border-gray-300 p-2 bg-gray-100">AB</th>
                    <th class="border border-gray-300 p-2 bg-gray-100">AB'</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="border border-gray-300 p-2 bg-gray-100">C'</td>
                    <td class="border border-gray-300 p-2 text-center">${values[0]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[1]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[3]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[2]}</td>
                </tr>
                <tr>
                    <td class="border border-gray-300 p-2 bg-gray-100">C</td>
                    <td class="border border-gray-300 p-2 text-center">${values[4]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[5]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[7]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[6]}</td>
                </tr>
            </tbody>`;
    } else if (numVars === 4) {
        // 4-variable K-Map implementation
        html += `
            <thead>
                <tr>
                    <th class="border border-gray-300 p-2 bg-gray-100"></th>
                    <th class="border border-gray-300 p-2 bg-gray-100">A'B'</th>
                    <th class="border border-gray-300 p-2 bg-gray-100">A'B</th>
                    <th class="border border-gray-300 p-2 bg-gray-100">AB</th>
                    <th class="border border-gray-300 p-2 bg-gray-100">AB'</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="border border-gray-300 p-2 bg-gray-100">C'D'</td>
                    <td class="border border-gray-300 p-2 text-center">${values[0]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[1]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[3]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[2]}</td>
                </tr>
                <tr>
                    <td class="border border-gray-300 p-2 bg-gray-100">C'D</td>
                    <td class="border border-gray-300 p-2 text-center">${values[4]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[5]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[7]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[6]}</td>
                </tr>
                <tr>
                    <td class="border border-gray-300 p-2 bg-gray-100">CD</td>
                    <td class="border border-gray-300 p-2 text-center">${values[12]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[13]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[15]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[14]}</td>
                </tr>
                <tr>
                    <td class="border border-gray-300 p-2 bg-gray-100">CD'</td>
                    <td class="border border-gray-300 p-2 text-center">${values[8]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[9]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[11]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[10]}</td>
                </tr>
            </tbody>`;
    } else {
        // Default to 2-variable K-Map
        html += `
            <thead>
                <tr>
                    <th class="border border-gray-300 p-2 bg-gray-100"></th>
                    <th class="border border-gray-300 p-2 bg-gray-100">A'</th>
                    <th class="border border-gray-300 p-2 bg-gray-100">A</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="border border-gray-300 p-2 bg-gray-100">B'</td>
                    <td class="border border-gray-300 p-2 text-center">${values[0]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[1]}</td>
                </tr>
                <tr>
                    <td class="border border-gray-300 p-2 bg-gray-100">B</td>
                    <td class="border border-gray-300 p-2 text-center">${values[2]}</td>
                    <td class="border border-gray-300 p-2 text-center">${values[3]}</td>
                </tr>
            </tbody>`;
    }

    html += '</table>';
    return html;
}

function simplifyExpression(values, numVars) {
    // Basic simplification logic - can be enhanced
    const ones = values.map((v, i) => v === '1' ? i : null).filter(v => v !== null);
    
    if (ones.length === 0) return "0";
    if (ones.length === values.length) return "1";
    
    // For demo purposes - real implementation would use proper K-Map grouping
    if (numVars === 2) {
        if (ones.includes(0) && ones.includes(1) && ones.includes(2) && ones.includes(3)) return "1";
        if (ones.includes(0) && ones.includes(2)) return "B'";
        if (ones.includes(1) && ones.includes(3)) return "A";
    }
    
    return "F = Σm(" + ones.join(',') + ")";
}

// Kirchhoff's Current Law (KCL) Calculator
function setupKCLInputs() {
    const count = parseInt(document.getElementById('kcl-current-count').value);
    const container = document.getElementById('kcl-inputs');
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'form-control';
        div.innerHTML = `
            <label class="label">
                <span class="label-text">Corrente I<sub>${i+1}</sub> (A):</span>
            </label>
            <div class="flex gap-2">
                <input type="number" step="0.01" id="i${i+1}" class="input input-bordered w-full">
                <select class="select select-bordered" data-input="i${i+1}">
                    <option value="in">Entrante</option>
                    <option value="out">Uscente</option>
                </select>
            </div>
        `;
        container.appendChild(div);
    }
}

function calculateKCL() {
    const inputs = document.querySelectorAll('#kcl-inputs input');
    let sumIn = 0;
    let sumOut = 0;
    let unknown = null;

    inputs.forEach(input => {
        const value = parseFloat(input.value);
        const direction = document.querySelector(`select[data-input="${input.id}"]`).value;
        
        if (isNaN(value)) {
            unknown = {input, direction};
        } else if (direction === 'in') {
            sumIn += value;
        } else {
            sumOut += value;
        }
    });

    if (unknown) {
        const result = unknown.direction === 'in' ? sumOut - sumIn : sumIn - sumOut;
        unknown.input.value = Math.abs(result).toFixed(2);
        
        const resultDiv = document.querySelector('#kcl-result div');
        resultDiv.innerHTML = `
            ΣI<sub>in</sub> = ΣI<sub>out</sub><br>
            ${sumIn.toFixed(2)}A = ${sumOut.toFixed(2)}A ${unknown.direction === 'in' ? '+' : '-'} I<sub>${unknown.input.id.substring(1)}</sub><br>
            I<sub>${unknown.input.id.substring(1)}</sub> = ${result.toFixed(2)}A (${result > 0 ? 'entrante' : 'uscente'})
        `;
        document.getElementById('kcl-result').classList.remove('hidden');
    } else {
        alert('Inserisci un campo vuoto per calcolare la corrente incognita');
    }
}

function resetKCL() {
    document.querySelectorAll('#kcl-inputs input').forEach(input => {
        input.value = '';
    });
    document.getElementById('kcl-result').classList.add('hidden');
}

// Kirchhoff's Voltage Law (KVL) Calculator
function setupKVLInputs() {
    const count = parseInt(document.getElementById('kvl-element-count').value);
    const container = document.getElementById('kvl-inputs');
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'form-control';
        div.innerHTML = `
            <label class="label">
                <span class="label-text">Tensione V<sub>${i+1}</sub> (V):</span>
            </label>
            <div class="flex gap-2">
                <input type="number" step="0.01" id="v${i+1}" class="input input-bordered w-full">
                <select class="select select-bordered" data-input="v${i+1}">
                    <option value="drop">Caduta</option>
                    <option value="rise">Salita</option>
                </select>
            </div>
        `;
        container.appendChild(div);
    }
}

function calculateKVL() {
    const inputs = document.querySelectorAll('#kvl-inputs input');
    let sumRise = 0;
    let sumDrop = 0;
    let unknown = null;

    inputs.forEach(input => {
        const value = parseFloat(input.value);
        const type = document.querySelector(`select[data-input="${input.id}"]`).value;
        
        if (isNaN(value)) {
            unknown = {input, type};
        } else if (type === 'rise') {
            sumRise += value;
        } else {
            sumDrop += value;
        }
    });

    if (unknown) {
        const result = unknown.type === 'rise' ? sumDrop - sumRise : sumRise - sumDrop;
        unknown.input.value = Math.abs(result).toFixed(2);
        
        const resultDiv = document.querySelector('#kvl-result div');
        resultDiv.innerHTML = `
            ΣV<sub>rise</sub> = ΣV<sub>drop</sub><br>
            ${sumRise.toFixed(2)}V = ${sumDrop.toFixed(2)}V ${unknown.type === 'rise' ? '+' : '-'} V<sub>${unknown.input.id.substring(1)}</sub><br>
            V<sub>${unknown.input.id.substring(1)}</sub> = ${result.toFixed(2)}V (${result > 0 ? 'salita' : 'caduta'})
        `;
        document.getElementById('kvl-result').classList.remove('hidden');
    } else {
        alert('Inserisci un campo vuoto per calcolare la tensione incognita');
    }
}

function resetKVL() {
    document.querySelectorAll('#kvl-inputs input').forEach(input => {
        input.value = '';
    });
    document.getElementById('kvl-result').classList.add('hidden');
}

// Initialize calculators on page load
document.addEventListener('DOMContentLoaded', function() {
    // KCL setup
    setupKCLInputs();
    document.getElementById('kcl-current-count').addEventListener('change', setupKCLInputs);
    
    // KVL setup
    setupKVLInputs();
    document.getElementById('kvl-element-count').addEventListener('change', setupKVLInputs);
});
