document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultContainer = document.getElementById('result');
    const loadingIndicator = document.getElementById('loading');
    const humanPercentage = document.getElementById('human-percentage');
    const aiPercentage = document.getElementById('ai-percentage');
    const featuresList = document.getElementById('features-list');
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
    
    analyzeBtn.addEventListener('click', function() {
        const text = textInput.value.trim();
        
        if (text.length < 50) {
            alert('Por favor, ingresa un texto más largo (mínimo 50 caracteres) para un análisis más preciso.');
            return;
        }
        
        // Mostrar indicador de carga
        resultContainer.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        
        // Simular análisis (en una aplicación real, esto sería una llamada a una API)
        setTimeout(() => {
            const analysisResult = analyzeText(text);
            displayResults(analysisResult);
            
            // Ocultar indicador de carga y mostrar resultados
            loadingIndicator.classList.add('hidden');
            resultContainer.classList.remove('hidden');
        }, 1500);
    });
    
    function analyzeText(text) {
        // Esta es una implementación simplificada para demostración
        // En una aplicación real, utilizarías algoritmos más complejos o APIs de NLP
        
        const features = [];
        let aiScore = 0;
        // Array para almacenar palabras/frases sospechosas de ser generadas por IA
        const aiPhrases = [];
        
        // Características que pueden indicar texto generado por IA
        
        // 1. Longitud de oraciones muy uniforme
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const sentenceLengths = sentences.map(s => s.trim().length);
        
        if (sentences.length > 3) {
            const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
            const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - avgLength, 2), 0) / sentenceLengths.length;
            const stdDev = Math.sqrt(variance);
            
            if (stdDev < avgLength * 0.3) {
                features.push('Longitud de oraciones muy uniforme (típico de IA)');
                aiScore += 15;
            } else {
                features.push('Variación natural en la longitud de oraciones (típico de humanos)');
                aiScore -= 10;
            }
        }
        
        // 2. Uso de frases genéricas o clichés
        const cliches = [
            'al final del día', 'en el gran esquema de las cosas', 'como se suele decir',
            'sin lugar a dudas', 'en mi humilde opinión', 'dicho esto',
            'en conclusión', 'para resumir', 'en resumen'
        ];
        
        let clicheCount = 0;
        cliches.forEach(cliche => {
            const regex = new RegExp('\\b' + cliche + '\\b', 'gi');
            const matches = text.match(regex);
            if (matches) clicheCount += matches.length;
        });
        
        if (clicheCount > 2) {
            features.push(`Uso frecuente de frases genéricas (${clicheCount} detectadas)`);
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
            .map(([word, count]) => `${word} (${count} veces)`);
            
        if (repeatedWords.length > 0) {
            features.push(`Repetición de palabras: ${repeatedWords.join(', ')}`);
            if (repeatedWords.length > 3) aiScore += 15;
            else aiScore += 5;
        } else {
            features.push('Buena variedad de vocabulario (típico de humanos)');
            aiScore -= 10;
        }
        
        // 4. Complejidad del texto
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        if (avgWordLength > 7) {
            features.push('Uso de palabras inusualmente largas (posible IA)');
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
            features.push('Ausencia total de errores tipográficos (inusual en humanos)');
            aiScore += 15;
        } else if (typoCount > 0 && typoCount < 5) {
            features.push(`Presencia de algunos errores menores (${typoCount} detectados, típico de humanos)`);
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
                features.push('Buena coherencia entre párrafos (típico de humanos)');
                aiScore -= 10;
            } else {
                features.push('Posible falta de coherencia entre párrafos');
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
            noPhrasesElement.textContent = 'No se detectaron palabras o frases específicas generadas por IA.';
            aiPhrasesList.appendChild(noPhrasesElement);
            aiPhrasesContainer.classList.remove('hidden');
        }
    }
});