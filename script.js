let reviewCount = 0;

function analyzeText() {
    const text = document.getElementById('textInput').value;
    const resultElement = document.getElementById('result');
    
    if (!text) {
        resultElement.textContent = 'Por favor ingresa un texto para analizar.';
        resultElement.style.backgroundColor = '#fff3cd';
        return;
    }
    
    // Simulación de análisis de IA (esto sería reemplazado por una API real)
    const isAIGenerated = Math.random() > 0.5;
    
    if (isAIGenerated) {
        resultElement.textContent = '⚠️ Este texto parece haber sido generado por IA.';
        resultElement.style.backgroundColor = '#f8d7da';
    } else {
        resultElement.textContent = '✅ Este texto parece haber sido escrito por un humano.';
        resultElement.style.backgroundColor = '#d1e7dd';
    }
    
    // Actualizar contador
    reviewCount++;
    document.getElementById('counter').textContent = `Revisiones realizadas: ${reviewCount}`;
}

// Event listener para el botón
document.getElementById('analyzeBtn').addEventListener('click', analyzeText);