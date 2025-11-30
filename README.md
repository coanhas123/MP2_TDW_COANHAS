# Flourished 🌸

Aplicação web React para explorar e gerir uma coleção pessoal de plantas com flores. Explore flores de diferentes regiões geográficas, adicione as suas próprias plantas e guarde as suas favoritas.

## Funcionalidades

- **Coleção Pessoal**: Adicione as suas próprias plantas com fotos
- **Exploração Regional**: Descubra flores de 5 continentes (Europa, Ásia, África, América do Sul, América Central)
- **Favoritos**: Guarde flores que gosta das coleções regionais
- **Informações Detalhadas**: Visualize dados taxonómicos, status de conservação e instruções de cuidados
- **Design Responsivo**: Funciona perfeitamente em dispositivos móveis, tablets e desktops

## Início Rápido

### Pré-requisitos
- Node.js 18+ e npm

### Instalação

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Deploy no GitHub Pages

### Configuração Rápida

1. **Atualizar o base path no `vite.config.js`**:
   ```javascript
   const REPO_NAME =
   ```

2. **Fazer push para o GitHub**:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages"
   git push origin main
   ```

3. **Ativar GitHub Pages**:
   - Vá para **Settings > Pages** no seu repositório GitHub
   - Em **Source**, selecione **GitHub Actions**
   - O workflow fará deploy automaticamente

4. **Aguardar o deploy**:
   - Vá para a aba **Actions** para ver o progresso
   - Quando concluído, o site estará disponível em: `https://coanhas123.github.io/MP2_TDW_COANHAS/`

📖 **Guia completo de deploy**: Ver [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🛠️ Tecnologias

- **React** - Biblioteca UI
- **React Router** - Roteamento client-side
- **Vite** - Build tool
- **iNaturalist API** - Dados de flores (gratuito, sem API key)
- **GBIF API** - Informações detalhadas sobre espécies

## 📁 Estrutura do Projeto

```
src/
├── components/      # Componentes reutilizáveis
├── pages/          # Páginas da aplicação
├── hooks/          # Custom hooks React
├── lib/            # Bibliotecas e utilitários
└── App.jsx         # Componente principal
```

## 📚 Documentação

- [Documentação Completa do Projeto](./PROJECT_DOCUMENTATION.md)
- [Guia de Deploy](./DEPLOYMENT.md)

## 📄 Licença

Este projeto é privado.

## 👤 Autor

Desenvolvido como parte de um projeto académico.

---

**Nota**: O projeto está configurado para deploy no GitHub Pages. URL: https://coanhas123.github.io/MP2_TDW_COANHAS/



