// SCRIPT PARA LIMPAR COMENTÁRIOS EXPLICATIVOS
// Execute: node clean-comments.js

const fs = require('fs');
const path = require('path');

// Lista de arquivos para limpar
const filesToClean = [
  'src/server.js',
  'src/services/RepositoryService.js',
  'src/resolvers/repositoryResolvers.js',
  'src/config/schema.js',
  'src/controllers/RepositoryController.js',
  'src/models/Repository.js'
];

function cleanComments(content) {
  return content
    // Remove comentários explicativos (linhas que começam com //)
    .replace(/^\s*\/\/.*$/gm, '')
    // Remove linhas vazias em excesso
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Remove espaços no final das linhas
    .replace(/[ \t]+$/gm, '')
    // Garante uma linha vazia no final
    .replace(/\n*$/, '\n');
}

console.log('🧹 Limpando comentários explicativos...\n');

filesToClean.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanedContent = cleanComments(content);
    
    fs.writeFileSync(filePath, cleanedContent);
    console.log(`✅ ${file} - comentários removidos`);
  } else {
    console.log(`❌ ${file} - arquivo não encontrado`);
  }
});

console.log('\n🎉 Limpeza concluída! Código pronto para produção.');
