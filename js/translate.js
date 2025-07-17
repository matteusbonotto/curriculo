// translate.js - Sistema de tradução para o currículo com API

let translatedData = null;
let currentLanguage = 'pt-br';

// Configuração de idiomas
const languageConfig = {
    'pt-br': {
        printText: 'Imprimir',
        flag: 'https://flagcdn.com/16x12/br.png',
        text: 'Português'
    },
    'en': {
        printText: 'Print',
        flag: 'https://flagcdn.com/16x12/us.png',
        text: 'English'
    },
    'es': {
        printText: 'Imprimir',
        flag: 'https://flagcdn.com/16x12/es.png',
        text: 'Español'
    }
};

// Traduções dos títulos das seções
const sectionTitles = {
    'pt-br': {
        resumo: 'Resumo',
        experienciaProfissional: 'Experiência Profissional',
        formacaoAcademica: 'Formação Acadêmica',
        idiomas: 'Idiomas',
        certificacoes: 'Certificações',
        projetosRelevantes: 'Projetos Relevantes',
        palavrasChave: 'Palavras-chave',
        principaisAtividades: 'Principais Atividades',
        emAndamento: 'Em andamento',
        atualmente: 'Atualmente',
        cursando: 'CURSANDO',
        atual: 'ATUAL',
        anos: 'anos',
        continuacao: 'Continuação'
    },
    'en': {
        resumo: 'Summary',
        experienciaProfissional: 'Professional Experience',
        formacaoAcademica: 'Education',
        idiomas: 'Languages',
        certificacoes: 'Certifications',
        projetosRelevantes: 'Relevant Projects',
        palavrasChave: 'Keywords',
        principaisAtividades: 'Main Activities',
        emAndamento: 'In progress',
        atualmente: 'Currently',
        cursando: 'STUDYING',
        atual: 'CURRENT',
        anos: 'years old',
        continuacao: 'Continuation'
    },
    'es': {
        resumo: 'Resumen',
        experienciaProfissional: 'Experiencia Profesional',
        formacaoAcademica: 'Formación Académica',
        idiomas: 'Idiomas',
        certificacoes: 'Certificaciones',
        projetosRelevantes: 'Proyectos Relevantes',
        palavrasChave: 'Palabras clave',
        principaisAtividades: 'Principales Actividades',
        emAndamento: 'En progreso',
        atualmente: 'Actualmente',
        cursando: 'ESTUDIANDO',
        atual: 'ACTUAL',
        anos: 'años',
        continuacao: 'Continuación'
    }
};

// Função para traduzir texto usando a API MyMemory
async function translateText(text, targetLanguage) {
    if (targetLanguage === 'pt-br' || !text || text.trim() === '') {
        return text;
    }
    
    try {
        const langPair = `pt|${targetLanguage}`;
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`);
        const data = await response.json();
        
        if (data.responseStatus === 200) {
            return data.responseData.translatedText;
        }
        return text; // Retorna o texto original se a tradução falhar
    } catch (error) {
        console.error('Erro na tradução:', error);
        return text; // Retorna o texto original em caso de erro
    }
}

// Função para traduzir todo o conteúdo do currículo
async function translateCurriculumContent(data, targetLanguage) {
    if (targetLanguage === 'pt-br') {
        return data;
    }
    
    const translatedData = JSON.parse(JSON.stringify(data));
    
    // Traduzir dados do indivíduo
    if (translatedData.individuo) {
        translatedData.individuo.ocupacao = await translateText(translatedData.individuo.ocupacao, targetLanguage);
        translatedData.individuo.descricao = await translateText(translatedData.individuo.descricao, targetLanguage);
        translatedData.individuo.keywords = await translateText(translatedData.individuo.keywords, targetLanguage);
        translatedData.individuo.local = await translateText(translatedData.individuo.local, targetLanguage);
        translatedData.individuo.pais = await translateText(translatedData.individuo.pais, targetLanguage);
    }
    
    // Traduzir histórico profissional
    if (translatedData.historicoProfissional) {
        for (const item of translatedData.historicoProfissional) {
            item.titulo = await translateText(item.titulo, targetLanguage);
            item.descricao = await translateText(item.descricao, targetLanguage);
            item.instituicao = await translateText(item.instituicao, targetLanguage);
            item.local = await translateText(item.local, targetLanguage);
            item.tipoLocal = await translateText(item.tipoLocal, targetLanguage);
        }
    }
    
    // Traduzir histórico acadêmico
    if (translatedData.historicoAcademico) {
        for (const item of translatedData.historicoAcademico) {
            item.curso = await translateText(item.curso, targetLanguage);
            item.instituicao = await translateText(item.instituicao, targetLanguage);
            item.tipo = await translateText(item.tipo, targetLanguage);
            item.descricao = await translateText(item.descricao, targetLanguage);
        }
    }
    
    // Traduzir idiomas
    if (translatedData.idiomas) {
        for (const item of translatedData.idiomas) {
            item.idioma = await translateText(item.idioma, targetLanguage);
            item.nivel = await translateText(item.nivel, targetLanguage);
            item.instituicao = await translateText(item.instituicao, targetLanguage);
        }
    }
    
    // Traduzir certificações
    if (translatedData.certificacoes) {
        for (const item of translatedData.certificacoes) {
            item.nome = await translateText(item.nome, targetLanguage);
            item.instituicao = await translateText(item.instituicao, targetLanguage);
            item.validade = await translateText(item.validade, targetLanguage);
        }
    }
    
    // Traduzir projetos
    if (translatedData.projetos) {
        for (const item of translatedData.projetos) {
            item.nome = await translateText(item.nome, targetLanguage);
            item.descricao = await translateText(item.descricao, targetLanguage);
        }
    }
    
    return translatedData;
}

// Função para mudar idioma
async function changeLanguage(language) {
    if (language === currentLanguage) return;
    
    currentLanguage = language;
    
    // Atualizar interface
    const currentFlag = document.getElementById('currentLanguageFlag');
    const currentText = document.getElementById('currentLanguageText');
    const printText = document.getElementById('printText');
    
    if (currentFlag) currentFlag.src = languageConfig[language].flag;
    if (currentText) currentText.textContent = languageConfig[language].text;
    if (printText) printText.textContent = languageConfig[language].printText;
    
    // Mostrar loading
    const curriculumContent = document.getElementById('curriculum-content');
    if (curriculumContent) {
        curriculumContent.innerHTML = '<div class="loading-message text-center"><p>Traduzindo currículo...</p></div>';
    }
    
    // Traduzir conteúdo
    if (curriculumData) {
        translatedData = await translateCurriculumContent(curriculumData, language);
        await renderizarCurriculo();
    }
}

// Função para traduzir texto estaticamente
function translateStaticText(text, targetLanguage) {
    if (targetLanguage === 'pt-br' || !text) {
        return text;
    }
    
    const translations = staticTranslations[targetLanguage];
    return translations && translations[text] ? translations[text] : text;
}

// Função para traduzir todo o conteúdo do currículo
function translateCurriculumContent(data, targetLanguage) {
    if (targetLanguage === 'pt-br') {
        return data;
    }
    
    const translatedData = JSON.parse(JSON.stringify(data));
    
    // Traduzir dados do indivíduo
    if (translatedData.individuo) {
        translatedData.individuo.ocupacao = translateStaticText(translatedData.individuo.ocupacao, targetLanguage);
        translatedData.individuo.descricao = translateStaticText(translatedData.individuo.descricao, targetLanguage);
        translatedData.individuo.keywords = translateStaticText(translatedData.individuo.keywords, targetLanguage);
        translatedData.individuo.local = translateStaticText(translatedData.individuo.local, targetLanguage);
        translatedData.individuo.pais = translateStaticText(translatedData.individuo.pais, targetLanguage);
    }
    
    // Traduzir histórico profissional
    if (translatedData.historicoProfissional) {
        translatedData.historicoProfissional.forEach(item => {
            item.titulo = translateStaticText(item.titulo, targetLanguage);
            item.descricao = translateStaticText(item.descricao, targetLanguage);
        });
    }
    
    // Traduzir histórico acadêmico
    if (translatedData.historicoAcademico) {
        translatedData.historicoAcademico.forEach(item => {
            item.descricao = translateStaticText(item.descricao, targetLanguage);
        });
    }
    
    // Traduzir idiomas
    if (translatedData.idiomas) {
        translatedData.idiomas.forEach(item => {
            item.nivel = translateStaticText(item.nivel, targetLanguage);
        });
    }
    
    // Traduzir certificações
    if (translatedData.certificacoes) {
        translatedData.certificacoes.forEach(item => {
            item.nome = translateStaticText(item.nome, targetLanguage);
            item.validade = translateStaticText(item.validade, targetLanguage);
        });
    }
    
    // Traduzir projetos
    if (translatedData.projetos) {
        translatedData.projetos.forEach(item => {
            item.descricao = translateStaticText(item.descricao, targetLanguage);
        });
    }
    
    return translatedData;
}

// Função para mudar idioma
async function changeLanguage(language) {
    if (language === currentLanguage) return;
    
    currentLanguage = language;
    
    // Atualizar interface
    const currentFlag = document.getElementById('currentLanguageFlag');
    const currentText = document.getElementById('currentLanguageText');
    const printText = document.getElementById('printText');
    
    if (currentFlag) currentFlag.src = languageConfig[language].flag;
    if (currentText) currentText.textContent = languageConfig[language].text;
    if (printText) printText.textContent = languageConfig[language].printText;
    
    // Mostrar loading
    const curriculumContent = document.getElementById('curriculum-content');
    if (curriculumContent) {
        curriculumContent.innerHTML = '<div class="loading-message text-center"><p>Carregando currículo...</p></div>';
    }
    
    // Traduzir conteúdo
    if (curriculumData) {
        translatedData = translateCurriculumContent(curriculumData, language);
        await renderizarCurriculo();
    }
}

// Função para obter tradução dos títulos
function getSectionTitle(key) {
    return sectionTitles[currentLanguage][key] || sectionTitles['pt-br'][key];
}
