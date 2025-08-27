<h3 align="center">Plataforma de Armazenamento e Compartilhamento de Arquivos</h3>

   <div align="center">
     Um site para armazenar e compartilhar arquivos como o Google Drive.
    </div>
</div>

## 📋 <a name="table">Índice</a>

1. 🤖 [Introdução](#introduction)
2. ⚙️ [Tecnologias](#tech-stack)
3. 🔋 [Funcionalidades](#features)
4. 🤸 [Início Rápido](#quick-start)
5. 🔗 [Recursos](#links)

## <a name="introduction">🤖 Introdução</a>

Uma plataforma de gerenciamento de armazenamento e compartilhamento de arquivos que permite aos usuários enviar, organizar e compartilhar arquivos de forma simples. Construído com Next.js e Appwrite, utilizando recursos avançados para um gerenciamento de arquivos fluido.

## <a name="tech-stack">⚙️ Tecnologias</a>

- React 19
- Next.js 15
- Appwrite
- TailwindCSS
- ShadCN
- TypeScript

## <a name="features">🔋 Funcionalidades</a>

👉 **Autenticação de Usuário com Appwrite**: Implementa cadastro, login e logout usando o sistema de autenticação do Appwrite.

👉 **Upload de Arquivos**: Envie facilmente diferentes tipos de arquivos, como documentos, imagens, vídeos e áudios, garantindo a segurança de seus dados.

👉 **Visualizar e Gerenciar Arquivos**: Navegue pelos arquivos enviados, visualize em uma nova aba, renomeie ou exclua arquivos.

👉 **Download de Arquivos**: Baixe seus arquivos enviados para acesso instantâneo a documentos importantes.

👉 **Compartilhamento de Arquivos**: Compartilhe arquivos com outras pessoas, permitindo colaboração e acesso fácil a conteúdos importantes.

👉 **Dashboard**: Obtenha uma visão geral com informações como armazenamento total e utilizado, uploads recentes e resumo por tipo de arquivo.

👉 **Pesquisa Global**: Encontre rapidamente arquivos e conteúdos compartilhados em toda a plataforma.

👉 **Opções de Ordenação**: Organize arquivos por data, nome ou tamanho.

👉 **Design Moderno e Responsivo**: Interface minimalista e funcional, adaptada para todos os dispositivos.

E muito mais, incluindo os recursos mais recentes do **React 19**, **Next.js 15** e **Appwrite**, além de boas práticas de arquitetura e reutilização de código.

## <a name="quick-start">🤸 Início Rápido</a>

Siga estas etapas para configurar o projeto localmente.

**Pré-requisitos**

Certifique-se de ter instalado:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/)

**Clonando o Repositório**

```bash
git clone https://github.com/JoabAlmeid/Guardaki.git
cd Guardaki
```

**Instalação**

```bash
npm install
```

**Configurar Variáveis de Ambiente**

Crie o arquivo `.env.local` na raiz do projeto e adicione:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT_ID=""
NEXT_PUBLIC_APPWRITE_PROJECT_NAME=""
NEXT_PUBLIC_APPWRITE_DATABASE=""
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=""
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION=""
NEXT_PUBLIC_APPWRITE_BUCKET=""
NEXT_APPWRITE_KEY=""
```

Substitua pelos valores reais obtidos ao criar seu projeto no [Appwrite](https://appwrite.io/).

**Rodando o Projeto**

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para visualizar.

## <a name="links">🔗 Recursos</a>

- Recursos usados no projeto: [clique aqui](https://jsm.dev/gdrive-kit)
