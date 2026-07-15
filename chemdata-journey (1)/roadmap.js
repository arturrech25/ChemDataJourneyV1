/**
 * ChemData Journey - Roadmap & Curriculum Data
 * Definição estruturada do cronograma de 6 meses (24 semanas) e os cursos/módulos.
 */

(function () {
  const RoadmapData = {
    months: [
      {
        id: 'm1',
        name: 'Mês 1: Python Aplicado à Química & Dados',
        description: 'Fundamentos de programação, tratamento de dados experimentais e bibliotecas essenciais para análise de dados científicos.',
        topics: ['Sintaxe Python & Lógica', 'NumPy (Matrizes e Vetores)', 'Pandas (Tabelas de Laboratório)', 'Matplotlib & Seaborn'],
        courses: [
          { id: 'py-1', title: 'Python Fundamentos para Ciência de Dados', hours: 20, desc: 'Variáveis, loops, funções e estruturas de dados básicas.' },
          { id: 'py-2', title: 'Manipulação de Dados Experimentais com Pandas', hours: 15, desc: 'DataFrames, limpeza de dados de laboratório, filtros e agregação.' },
          { id: 'py-3', title: 'Análise Numérica com NumPy & SciPy', hours: 15, desc: 'Álgebra linear básica, tratamento de espectros e matrizes de dados.' },
          { id: 'py-4', title: 'Visualização de Dados Químicos e Espectroscopia', hours: 12, desc: 'Plotagem de curvas cinéticas, espectros UV-Vis/FTIR e gráficos elegantes.' }
        ]
      },
      {
        id: 'm2',
        name: 'Mês 2: SQL & Estrutura de Bancos de Dados',
        description: 'Modelagem de dados químicos e consulta estruturada para gerenciar informações de reações e reagentes.',
        topics: ['Bancos Relacionais (PostgreSQL/SQLite)', 'Consultas SQL (SELECT, JOINs)', 'Funções de Agregação', 'Integração Python + SQLite'],
        courses: [
          { id: 'sql-1', title: 'Introdução a Banco de Dados e SQL', hours: 12, desc: 'Instalação, criação de tabelas e comandos básicos de inserção/seleção.' },
          { id: 'sql-2', title: 'Consultas Avançadas e Junções de Tabelas', hours: 15, desc: 'Joins complexos, subqueries e manipulação de múltiplos conjuntos de dados.' },
          { id: 'sql-3', title: 'Modelagem de Dados Químicos (Inventários & Reações)', hours: 10, desc: 'Esquemas Entidade-Relacionamento aplicados a registros de compostos.' },
          { id: 'sql-4', title: 'Integração SQL com Python (Pandas SQL)', hours: 10, desc: 'Leitura de consultas diretas em DataFrames usando SQLAlchemy.' }
        ]
      },
      {
        id: 'm3',
        name: 'Mês 3: Estatística Aplicada e Planejamento Experimental',
        description: 'Estatística descritiva e inferencial aplicada ao controle de qualidade de medições e otimização de reações (DoE).',
        topics: ['Estatística Descritiva & Probabilidade', 'Testes de Hipóteses (t-Student, ANOVA)', 'Regressão Linear e Correlações', 'Planejamento de Experimentos (DoE)'],
        courses: [
          { id: 'est-1', title: 'Estatística Descritiva e Probabilidade em Laboratório', hours: 15, desc: 'Média, desvio padrão, variância e distribuições de Gauss/t-Student.' },
          { id: 'est-2', title: 'Testes de Hipótese e ANOVA na Química Analítica', hours: 15, desc: 'Comparação de métodos de medição e validação de calibração.' },
          { id: 'est-3', title: 'Modelos de Regressão Linear Aplicados a Curvas de Calibração', hours: 12, desc: 'Ajuste de curvas, cálculo de R² e estimativa de incertezas analíticas.' },
          { id: 'est-4', title: 'Planejamento de Experimentos (DoE) & Superfície de Resposta', hours: 15, desc: 'Planejamento fatorial para otimização de rendimento de reações.' }
        ]
      },
      {
        id: 'm4',
        name: 'Mês 4: Machine Learning Prático & Quimiometria',
        description: 'Modelagem preditiva de propriedades físicas, classificação química e redução de dimensionalidade espectral.',
        topics: ['Regressão e Classificação Supervisionada', 'Algoritmos Scikit-Learn', 'Redução de Dimensionalidade (PCA)', 'Agrupamento Clássico (K-Means)'],
        courses: [
          { id: 'ml-1', title: 'Machine Learning Supervisionado com Scikit-Learn', hours: 20, desc: 'Árvores de decisão, Regressão Logística e Random Forest.' },
          { id: 'ml-2', title: 'Quimiometria: Redução de Dimensionalidade (PCA)', hours: 15, desc: 'Análise de Componentes Principais aplicada a dados de espectros FTIR/RMN.' },
          { id: 'ml-3', title: 'Algoritmos de Agrupamento (Clustering) Aplicados a Moléculas', hours: 12, desc: 'K-Means e agrupamento hierárquico para identificação de famílias químicas.' },
          { id: 'ml-4', title: 'Validação de Modelos e Prevenção de Overfitting', hours: 12, desc: 'Validação cruzada, métricas (R², RMSE, Acurácia, F1-Score).' }
        ]
      },
      {
        id: 'm5',
        name: 'Mês 5: Portfólio no GitHub & Projetos Kaggle',
        description: 'Construção de portfólio profissional e participação em desafios práticos de ciência de dados.',
        topics: ['Controle de Versão com Git & GitHub', 'Escrever Documentação Científica', 'Análise de Datasets do Kaggle', 'Storytelling com Notebooks'],
        courses: [
          { id: 'kag-1', title: 'Dominando o Git e GitHub para Cientistas de Dados', hours: 10, desc: 'Commits, ramificação, pull requests e escrita de READMEs impactantes.' },
          { id: 'kag-2', title: 'Storytelling de Dados em Química: Jupyter Notebooks', hours: 12, desc: 'Estruturação de relatórios interativos contendo hipóteses químicas e código.' },
          { id: 'kag-3', title: 'Análise Exploratória em Competições do Kaggle', hours: 15, desc: 'Manipulação de bases públicas de compostos químicos ou fármacos.' },
          { id: 'kag-4', title: 'Engenharia de Features para Dados Químicos', hours: 15, desc: 'Representação molecular simples (SMILES, fingerprints) para modelos de ML.' }
        ]
      },
      {
        id: 'm6',
        name: 'Mês 6: Projeto de Conclusão & Preparação de Carreira',
        description: 'Desenvolvimento do projeto final focado em dados do setor químico ou industrial e preparação para o mercado.',
        topics: ['Desenvolvimento do Projeto Próprio', 'Ajuste Fino de Hiperparâmetros', 'Montagem do Currículo Técnico', 'Simulação de Entrevistas de Dados'],
        courses: [
          { id: 'proj-1', title: 'Concepção do Projeto de Transição Química-Dados', hours: 15, desc: 'Definição do escopo, coleta de dados químicos reais e modelagem inicial.' },
          { id: 'proj-2', title: 'Desenvolvimento e Refinamento do Modelo Preditivo', hours: 20, desc: 'Implementação, testes de algoritmos e ajuste fino dos hiperparâmetros.' },
          { id: 'proj-3', title: 'Construção de um App de Demonstração (Ex: Streamlit/Dash)', hours: 15, desc: 'Criação de uma interface visual simples para apresentar o modelo funcionando.' },
          { id: 'proj-4', title: 'LinkedIn e Preparação para Entrevistas de Data Science', hours: 15, desc: 'Como vender a experiência em laboratório como um diferencial analítico.' }
        ]
      }
    ],

    weeks: Array.from({ length: 24 }, (_, i) => {
      const weekNum = i + 1;
      const monthNum = Math.ceil(weekNum / 4);
      
      const focusDetails = [
        // Mês 1: Python
        { title: 'Variáveis e Estruturas de Dados', desc: 'Aprender sintaxe básica do Python, listas, tuplas e dicionários aplicados a dados de reagentes.' },
        { title: 'Controle de Fluxo e Funções', desc: 'Criar funções em Python para automatizar cálculos químicos (ex: diluições, rendimentos).' },
        { title: 'Introdução ao Pandas', desc: 'Carregar tabelas de dados experimentais em DataFrames do Pandas e fazer limpeza básica.' },
        { title: 'Visualização Científica', desc: 'Plotar espectros de laboratório e gráficos de dispersão usando Matplotlib.' },
        // Mês 2: SQL
        { title: 'Fundamentos de Bancos Relacionais', desc: 'Conectar ao SQLite e criar tabelas para catalogar insumos e propriedades químicas.' },
        { title: 'Queries e Filtragem Avançada', desc: 'Fazer consultas SQL aplicando filtros complexos de pureza, lote e datas.' },
        { title: 'Junção de Dados (JOINs)', desc: 'Unir tabelas de ensaios analíticos com tabelas de identificação de amostras.' },
        { title: 'Python SQL Integrado', desc: 'Extrair relatórios de bancos de dados via queries SQL diretamente no Jupyter Notebook.' },
        // Mês 3: Estatística
        { title: 'Estatística Descritiva', desc: 'Calcular desvios padrão, médias de replicatas e verificar outliers analíticos.' },
        { title: 'Testes de Hipótese Clássicos', desc: 'Aplicar Teste t para verificar se dois métodos de análise produzem resultados estatisticamente iguais.' },
        { title: 'Regressões e Curvas de Calibração', desc: 'Ajustar regressões lineares para curvas padrões de analitos e estimar limites de detecção.' },
        { title: 'Iniciação em DoE (Design of Experiments)', desc: 'Montar uma matriz de planejamento fatorial 2² para simular otimização química.' },
        // Mês 4: Machine Learning
        { title: 'Introdução ao Scikit-Learn', desc: 'Compreender o fluxo fit-predict usando um dataset de propriedades de compostos.' },
        { title: 'Previsão de Propriedades (Regressão)', desc: 'Treinar um modelo para prever ponto de ebulição ou solubilidade com base em descritores.' },
        { title: 'Classificação de Amostras', desc: 'Usar Random Forest para classificar a qualidade de amostras de lote industrial.' },
        { title: 'Redução de Dimensionalidade (PCA)', desc: 'Aplicar PCA para compactar dados de espectros infravermelho em 2 ou 3 componentes principais.' },
        // Mês 5: Kaggle & GitHub
        { title: 'Dominando o Git', desc: 'Criar repositório local e publicar no GitHub seus primeiros scripts de cálculo de laboratório.' },
        { title: 'Relatórios Jupyter Interativos', desc: 'Escrever relatórios no notebook mesclando fórmulas químicas (LaTeX) com explicações analíticas.' },
        { title: 'Desafios Científicos de Dados', desc: 'Analisar e contribuir em competições de biologia/química no Kaggle.' },
        { title: 'Engenharia de Features Químicas', desc: 'Usar representações simples (como smiles de compostos) e converter em dados vetoriais.' },
        // Mês 6: Projeto Final
        { title: 'Concepção do Projeto de Portfólio', desc: 'Definir o problema real de química para resolver usando dados (ex: previsão de solubilidade).' },
        { title: 'Processamento e Modelagem', desc: 'Carregar os dados reais escolhidos, fazer a análise exploratória e testar 3 modelos de ML.' },
        { title: 'Interface e Visualização do Projeto', desc: 'Escrever o relatório final ou criar uma interface iterativa (Dashboard) para demonstrar o modelo.' },
        { title: 'Polimento do LinkedIn e Portfólio', desc: 'Escrever o artigo do projeto no LinkedIn e deixar o GitHub impecável para recrutadores.' }
      ];

      return {
        number: weekNum,
        monthId: `m${monthNum}`,
        title: `Semana ${weekNum}: ${focusDetails[i].title}`,
        description: focusDetails[i].desc,
        estimatedHours: 8 + (weekNum % 3) * 2 // Carga horária semanal aproximada
      };
    })
  };

  window.RoadmapData = RoadmapData;
})();
