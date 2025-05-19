document.addEventListener('DOMContentLoaded', function() {
    // Elementos básicos de la interfaz
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultContainer = document.getElementById('result');
    const loadingIndicator = document.getElementById('loading');
    const humanPercentage = document.getElementById('human-percentage');
    const aiPercentage = document.getElementById('ai-percentage');
    const featuresList = document.getElementById('features-list');
    const languageSelect = document.getElementById('language-select');
    const apiSelect = document.getElementById('api-select');
    
    // Elementos para métricas avanzadas
    const advancedMetrics = document.getElementById('advanced-metrics');
    const lexicalEntropy = document.getElementById('lexical-entropy');
    const semanticCoherence = document.getElementById('semantic-coherence');
    const syntacticComplexity = document.getElementById('syntactic-complexity');
    const naturalnessIndex = document.getElementById('naturalness-index');
    
    // Elementos para resultados de API
    const apiResult = document.getElementById('api-result');
    const apiScoreValue = document.getElementById('api-score-value');
    const apiDetails = document.getElementById('api-details');
    
    // Elementos para historial
    const historySection = document.getElementById('history-section');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    // Elemento para mostrar palabras/frases generadas por IA
    const aiPhrasesContainer = document.createElement('div');
    aiPhrasesContainer.id = 'ai-phrases-container';
    aiPhrasesContainer.className = 'ai-phrases-section hidden';
    
    // Crear título para la sección
    const aiPhrasesTitle = document.createElement('h3');
    aiPhrasesTitle.textContent = 'Palabras/frases posiblemente generadas por IA:';
    aiPhrasesContainer.appendChild(aiPhrasesTitle);
    
    // Crear contenedor para las frases
    const aiPhrasesList = document.createElement('div');
    aiPhrasesList.id = 'ai-phrases-list';
    aiPhrasesContainer.appendChild(aiPhrasesList);
    
    // Añadir al DOM después de la lista de características
    document.querySelector('.analysis-details').appendChild(aiPhrasesContainer);
    
    // Cargar historial al iniciar
    loadHistory();
    
    // Event listeners
    analyzeBtn.addEventListener('click', function() {
        const text = textInput.value.trim();
        const selectedLanguage = languageSelect.value;
        const selectedApi = apiSelect.value;
        
        if (text.length < 50) {
            alert('Por favor, ingresa un texto más largo (mínimo 50 caracteres) para un análisis más preciso.');
            return;
        }
        
        // Mostrar indicador de carga
        resultContainer.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        
        // Determinar qué tipo de análisis realizar según la API seleccionada
        if (selectedApi === 'local') {
            // Análisis local
            setTimeout(() => {
                const analysisResult = analyzeText(text, selectedLanguage);
                displayResults(analysisResult);
                calculateAdvancedMetrics(text, selectedLanguage);
                saveToHistory(text, analysisResult);
                
                // Ocultar indicador de carga y mostrar resultados
                loadingIndicator.classList.add('hidden');
                resultContainer.classList.remove('hidden');
            }, 1500);
        } else {
            // Análisis con API externa
            callExternalApi(text, selectedApi, selectedLanguage)
                .then(apiResponse => {
                    // Realizar también análisis local para comparar
                    const localAnalysis = analyzeText(text, selectedLanguage);
                    
                    // Combinar resultados
                    const combinedResults = {
                        ...localAnalysis,
                        apiResult: apiResponse
                    };
                    
                    displayResults(combinedResults);
                    displayApiResults(apiResponse, selectedApi);
                    calculateAdvancedMetrics(text, selectedLanguage);
                    saveToHistory(text, combinedResults);
                    
                    // Ocultar indicador de carga y mostrar resultados
                    loadingIndicator.classList.add('hidden');
                    resultContainer.classList.remove('hidden');
                })
                .catch(error => {
                    console.error('Error al llamar a la API:', error);
                    alert('Hubo un error al conectar con la API externa. Se realizará un análisis local.');
                    
                    // Realizar análisis local como fallback
                    const analysisResult = analyzeText(text, selectedLanguage);
                    displayResults(analysisResult);
                    calculateAdvancedMetrics(text, selectedLanguage);
                    saveToHistory(text, analysisResult);
                    
                    // Ocultar indicador de carga y mostrar resultados
                    loadingIndicator.classList.add('hidden');
                    resultContainer.classList.remove('hidden');
                });
        }
    });
    
    // Evento para limpiar historial
    clearHistoryBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas borrar todo el historial de análisis?')) {
            localStorage.removeItem('textAnalysisHistory');
            loadHistory(); // Recargar la vista del historial
        }
    });
    
    // Función para llamar a APIs externas
    async function callExternalApi(text, apiType, language) {
        // En una implementación real, aquí irían las llamadas a las APIs
        // Por ahora, simulamos las respuestas
        
        return new Promise((resolve) => {
            setTimeout(() => {
                if (apiType === 'gptdetector') {
                    resolve({
                        score: Math.random() * 100,
                        confidence: Math.random() * 100,
                        details: {
                            message: 'Análisis completado con GPT Detector',
                            patternMatches: Math.floor(Math.random() * 10),
                            stylometricScore: (Math.random() * 10).toFixed(2)
                        }
                    });
                } else if (apiType === 'zerogpt') {
                    resolve({
                        aiProbability: Math.random() * 100,
                        humanProbability: Math.random() * 100,
                        confidence: Math.random() * 100,
                        details: {
                            message: 'Análisis completado con ZeroGPT',
                            detectedPatterns: Math.floor(Math.random() * 15),
                            textComplexity: (Math.random() * 10).toFixed(2)
                        }
                    });
                }
            }, 2000);
        });
    }
    
    // Función para calcular métricas avanzadas
    function calculateAdvancedMetrics(text, language) {
        // Cálculo de entropía léxica (variedad de vocabulario)
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const uniqueWords = new Set(words);
        const lexicalEntropyValue = (uniqueWords.size / words.length * 10).toFixed(2);
        
        // Cálculo de coherencia semántica (simplificado)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const semanticCoherenceValue = (Math.random() * 5 + 5).toFixed(2); // Simulado
        
        // Cálculo de complejidad sintáctica
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        const avgSentenceLength = words.length / sentences.length;
        const syntacticComplexityValue = ((avgWordLength + avgSentenceLength) / 5).toFixed(2);
        
        // Índice de naturalidad (simulado)
        const naturalnessIndexValue = (Math.random() * 3 + 7).toFixed(2);
        
        // Actualizar la interfaz
        lexicalEntropy.textContent = lexicalEntropyValue;
        semanticCoherence.textContent = semanticCoherenceValue;
        syntacticComplexity.textContent = syntacticComplexityValue;
        naturalnessIndex.textContent = naturalnessIndexValue;
        
        // Mostrar sección de métricas avanzadas
        advancedMetrics.classList.remove('hidden');
    }
    
    // Función para mostrar resultados de API
    function displayApiResults(apiResponse, apiType) {
        apiResult.classList.remove('hidden');
        
        if (apiType === 'gptdetector') {
            apiScoreValue.textContent = `${apiResponse.score.toFixed(2)}% IA (Confianza: ${apiResponse.confidence.toFixed(2)}%)`;
            apiDetails.innerHTML = `
                <p>Patrones detectados: ${apiResponse.details.patternMatches}</p>
                <p>Puntuación estilométrica: ${apiResponse.details.stylometricScore}</p>
                <p>${apiResponse.details.message}</p>
            `;
        } else if (apiType === 'zerogpt') {
            apiScoreValue.textContent = `${apiResponse.aiProbability.toFixed(2)}% IA (Confianza: ${apiResponse.confidence.toFixed(2)}%)`;
            apiDetails.innerHTML = `
                <p>Patrones detectados: ${apiResponse.details.detectedPatterns}</p>
                <p>Complejidad del texto: ${apiResponse.details.textComplexity}</p>
                <p>${apiResponse.details.message}</p>
            `;
        }
    }
    
    // Función para guardar análisis en el historial
    function saveToHistory(text, result) {
        // Obtener historial existente o crear uno nuevo
        const history = JSON.parse(localStorage.getItem('textAnalysisHistory') || '[]');
        
        // Añadir nuevo análisis al principio
        history.unshift({
            id: Date.now(),
            date: new Date().toLocaleString(),
            text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
            fullText: text,
            result: result
        });
        
        // Limitar a 10 entradas
        if (history.length > 10) {
            history.pop();
        }
        
        // Guardar en localStorage
        localStorage.setItem('textAnalysisHistory', JSON.stringify(history));
        
        // Actualizar la vista del historial
        loadHistory();
    }
    
    // Función para cargar historial
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('textAnalysisHistory') || '[]');
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = '<p class="no-history">No hay análisis previos guardados.</p>';
            return;
        }
        
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-item-header">
                    <span class="history-date">${item.date}</span>
                    <span class="history-score">IA: ${item.result.aiProbability.toFixed(1)}% | Humano: ${item.result.humanProbability.toFixed(1)}%</span>
                </div>
                <div class="history-text">${item.text}</div>
                <button class="history-view-btn">Ver detalles</button>
            `;
            
            // Evento para ver detalles del historial
            const viewBtn = historyItem.querySelector('.history-view-btn');
            viewBtn.addEventListener('click', function() {
                textInput.value = item.fullText;
                displayResults(item.result);
                if (item.result.apiResult) {
                    displayApiResults(item.result.apiResult, 'gptdetector'); // Asumimos GPT Detector por defecto
                }
                calculateAdvancedMetrics(item.fullText, 'auto');
                resultContainer.classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            historyList.appendChild(historyItem);
        });
    }
    
    function analyzeText(text, language = 'auto') {
        // Esta es una implementación simplificada para demostración
        // En una aplicación real, utilizarías algoritmos más complejos o APIs de NLP
        
        const features = [];
        let aiScore = 0;
        // Array para almacenar palabras/frases sospechosas de ser generadas por IA
        const aiPhrases = [];
        
        // Ajustar análisis según el idioma seleccionado
        let cliches, connectors, formalWords, formulaicPhrases;
        
        if (language === 'en') {
            // Configuración para inglés
            cliches = [
                'at the end of the day', 'in the grand scheme of things', 'as they say',
                'without a doubt', 'in my humble opinion', 'that being said',
                'in conclusion', 'to summarize', 'in summary'
            ];
            
            connectors = ['however', 'therefore', 'furthermore', 'on the other hand', 'consequently'];
            
            formalWords = [
                'paradigm', 'implementation', 'methodology', 'conceptualization',
                'infrastructure', 'optimization', 'sustainability', 'interoperability',
                'scalability', 'functionality', 'viability', 'strategic',
                'holistic', 'synergistic', 'innovative', 'disruptive'
            ];
            
            formulaicPhrases = [
                'firstly[,.]? secondly[,.]? (?:and )?(?:finally|lastly)',
                'on one hand[,.]? on the other hand',
                'it is worth noting that',
                'it is important to note that',
                'in conclusion[,.]? we can affirm that',
                'without a doubt'
            ];
        } else {
            // Configuración para español (por defecto)
            cliches = [
                'al final del día', 'en el gran esquema de las cosas', 'como se suele decir',
                'sin lugar a dudas', 'en mi humilde opinión', 'dicho esto',
                'en conclusión', 'para resumir', 'en resumen'
            ];
            
            connectors = ['sin embargo', 'por lo tanto', 'además', 'por otro lado', 'en consecuencia'];
            
            formalWords = [
                'paradigma', 'implementación', 'metodología', 'conceptualización',
                'infraestructura', 'optimización', 'sostenibilidad', 'interoperabilidad',
                'escalabilidad', 'funcionalidad', 'viabilidad', 'estratégico',
                'holístico', 'sinérgico', 'innovador', 'disruptivo'
            ];
            
            formulaicPhrases = [
                'en primer lugar[,.]? en segundo lugar[,.]? (?:y )?(?:en )?(?:tercer|último) lugar',
                'por un lado[,.]? por otro lado',
                'cabe destacar que',
                'es importante señalar que',
                'en conclusión[,.]? podemos afirmar que',
                'sin lugar a dudas'
            ];
        }
        
        // Características que pueden indicar texto generado por IA
        
        // 1. Longitud de oraciones muy uniforme
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const sentenceLengths = sentences.map(s => s.trim().length);
        
        if (sentences.length > 3) {
            const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
            const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - avgLength, 2), 0) / sentenceLengths.length;
            const stdDev = Math.sqrt(variance);
            
            if (stdDev < avgLength * 0.3) {
                features.push(language === 'en' ? 'Very uniform sentence length (typical of AI)' : 'Longitud de oraciones muy uniforme (típico de IA)');
                aiScore += 15;
            } else {
                features.push(language === 'en' ? 'Natural variation in sentence length (typical of humans)' : 'Variación natural en la longitud de oraciones (típico de humanos)');
                aiScore -= 10;
            }
        }
        
        // 2. Uso de frases genéricas o clichés
        let clicheCount = 0;
        cliches.forEach(cliche => {
            const regex = new RegExp('\\b' + cliche + '\\b', 'gi');
            const matches = text.match(regex);
            if (matches) clicheCount += matches.length;
        });
        
        if (clicheCount > 2) {
            features.push(language === 'en' 
                ? `Frequent use of generic phrases (${clicheCount} detected)` 
                : `Uso frecuente de frases genéricas (${clicheCount} detectadas)`);
            aiScore += 10;
        }
        
        // 3. Repetición de palabras o frases
        const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });
        
        const repeatedWords = Object.entries(wordFreq)
            .filter(([word, count]) => count > 3)
            .map(([word, count]) => `${word} (${count} ${language === 'en' ? 'times' : 'veces'})`);
            
        if (repeatedWords.length > 0) {
            features.push(language === 'en' 
                ? `Word repetition: ${repeatedWords.join(', ')}` 
                : `Repetición de palabras: ${repeatedWords.join(', ')}`);
            if (repeatedWords.length > 3) aiScore += 15;
            else aiScore += 5;
        } else {
            features.push(language === 'en' 
                ? 'Good vocabulary variety (typical of humans)' 
                : 'Buena variedad de vocabulario (típico de humanos)');
            aiScore -= 10;
        }
        
        // 4. Complejidad del texto
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        if (avgWordLength > 7) {
            features.push(language === 'en' 
                ? 'Use of unusually long words (possible AI)' 
                : 'Uso de palabras inusualmente largas (posible IA)');
            aiScore += 10;
        }
        
        // 5. Errores gramaticales o tipográficos menores
        // En una aplicación real, usarías una biblioteca de verificación gramatical
        // Aquí simplemente verificamos algunos patrones comunes
        const typoPatterns = [
            /\s{2,}/g, // Espacios múltiples
            /\b(el|la|los|las)\s+\1\b/gi, // Artículos repetidos
            /\b(que|de|en|con|por)\s+\1\b/gi // Preposiciones repetidas
        ];
        
        let typoCount = 0;
        typoPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) typoCount += matches.length;
        });
        
        if (typoCount === 0 && text.length > 200) {
            features.push(language === 'en' 
                ? 'Complete absence of typographical errors (unusual in humans)' 
                : 'Ausencia total de errores tipográficos (inusual en humanos)');
            aiScore += 15;
        } else if (typoCount > 0 && typoCount < 5) {
            features.push(language === 'en' 
                ? `Presence of some minor errors (${typoCount} detected, typical of humans)` 
                : `Presencia de algunos errores menores (${typoCount} detectados, típico de humanos)`);
            aiScore -= 15;
        }
        
        // 6. Coherencia contextual
        // Simplificado para esta demo
        const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
        if (paragraphs.length > 1) {
            // Verificar si hay palabras conectoras entre párrafos
            let hasConnectors = false;
            const connectors = ['sin embargo', 'por lo tanto', 'además', 'por otro lado', 'en consecuencia'];
            
            for (let i = 1; i < paragraphs.length; i++) {
                const paragraph = paragraphs[i].toLowerCase();
                if (connectors.some(c => paragraph.includes(c))) {
                    hasConnectors = true;
                    break;
                }
            }
            
            if (hasConnectors) {
                features.push(language === 'en' 
                    ? 'Good coherence between paragraphs (typical of humans)' 
                    : 'Buena coherencia entre párrafos (típico de humanos)');
                aiScore -= 10;
            } else {
                features.push(language === 'en' 
                    ? 'Possible lack of coherence between paragraphs' 
                    : 'Posible falta de coherencia entre párrafos');
                aiScore += 5;
            }
        }
        
        // Ajustar puntuación final
        aiScore = Math.max(0, Math.min(100, aiScore + 50)); // Base de 50% ajustada por características
        const humanScore = 100 - aiScore;
        
        // Detectar palabras o frases que podrían ser generadas por IA
        // 1. Palabras inusualmente formales o técnicas
        const formalWords = [
            'paradigma', 'implementación', 'metodología', 'conceptualización',
            'infraestructura', 'optimización', 'sostenibilidad', 'interoperabilidad',
            'escalabilidad', 'funcionalidad', 'viabilidad', 'estratégico',
            'holístico', 'sinérgico', 'innovador', 'disruptivo'
        ];
        
        formalWords.forEach(word => {
            const regex = new RegExp('\\b' + word + '\\b', 'gi');
            const matches = text.match(regex);
            if (matches) {
                matches.forEach(match => {
                    if (!aiPhrases.includes(match)) {
                        aiPhrases.push(match);
                    }
                });
            }
        });
        
        // 2. Frases excesivamente estructuradas o formulaicas
        const formulaicPhrases = [
            'en primer lugar[,.]? en segundo lugar[,.]? (?:y )?(?:en )?(?:tercer|último) lugar',
            'por un lado[,.]? por otro lado',
            'cabe destacar que',
            'es importante señalar que',
            'en conclusión[,.]? podemos afirmar que',
            'sin lugar a dudas'
        ];
        
        formulaicPhrases.forEach(phrase => {
            const regex = new RegExp(phrase, 'gi');
            const matches = text.match(regex);
            if (matches) {
                matches.forEach(match => {
                    if (!aiPhrases.includes(match)) {
                        aiPhrases.push(match);
                    }
                });
            }
        });
        
        // 3. Detectar oraciones perfectamente balanceadas (típico de IA)
        const perfectSentences = sentences.filter(sentence => {
            // Oraciones largas sin errores y con estructura perfecta
            const words = sentence.split(/\s+/).filter(w => w.length > 0);
            return words.length > 15 && 
                   sentence.includes(',') && 
                   !sentence.match(/\s{2,}/) && // Sin espacios múltiples
                   !sentence.match(/[,.!?]{2,}/); // Sin puntuación repetida
        });
        
        if (perfectSentences.length > 0 && text.length > 300) {
            // Añadir solo las primeras 2 oraciones perfectas para no sobrecargar
            perfectSentences.slice(0, 2).forEach(sentence => {
                if (!aiPhrases.includes(sentence)) {
                    aiPhrases.push(sentence);
                }
            });
        }
        
        return {
            aiProbability: aiScore,
            humanProbability: humanScore,
            features: features,
            aiPhrases: aiPhrases
        };
    }
    
    function displayResults(result) {
        // Actualizar porcentajes
        humanPercentage.textContent = `${result.humanProbability}%`;
        aiPercentage.textContent = `${result.aiProbability}%`;
        
        // Actualizar estilos de los círculos según los resultados
        document.getElementById('human-score').style.opacity = result.humanProbability / 100;
        document.getElementById('ai-score').style.opacity = result.aiProbability / 100;
        
        // Mostrar características detectadas
        featuresList.innerHTML = '';
        result.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        
        // Mostrar palabras/frases generadas por IA
        const aiPhrasesContainer = document.getElementById('ai-phrases-container');
        const aiPhrasesList = document.getElementById('ai-phrases-list');
        aiPhrasesList.innerHTML = '';
        
        if (result.aiPhrases && result.aiPhrases.length > 0) {
            result.aiPhrases.forEach(phrase => {
                const phraseElement = document.createElement('div');
                phraseElement.className = 'ai-phrase';
                phraseElement.textContent = phrase;
                aiPhrasesList.appendChild(phraseElement);
            });
            aiPhrasesContainer.classList.remove('hidden');
        } else {
            const noPhrasesElement = document.createElement('p');
            const currentLang = languageSelect.value;
            noPhrasesElement.textContent = currentLang === 'en' 
                ? 'No specific AI-generated words or phrases were detected.' 
                : 'No se detectaron palabras o frases específicas generadas por IA.';
            aiPhrasesList.appendChild(noPhrasesElement);
            aiPhrasesContainer.classList.remove('hidden');
        }
        
        // Actualizar título de la sección de frases AI según el idioma
        const aiPhrasesTitle = aiPhrasesContainer.querySelector('h3');
        if (aiPhrasesTitle) {
            const currentLang = languageSelect.value;
            aiPhrasesTitle.textContent = currentLang === 'en' 
                ? 'Words/phrases possibly generated by AI:' 
                : 'Palabras/frases posiblemente generadas por IA:';
        }
    }
});