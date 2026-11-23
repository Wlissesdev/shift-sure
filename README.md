<div align="center">

# PlantaHoje

**Plataforma de conexão entre médicos para substituição de plantões**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend%20as%20a%20Service-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](./LICENSE)

</div>

---

## 📖 Sobre

O **PlantaHoje** é uma aplicação web que conecta médicos para a substituição de plantões de forma rápida e segura. A plataforma resolve um problema recorrente na rotina médica: quando um profissional não pode cumprir um plantão, ele precisa encontrar um substituto qualificado com agilidade — e os médicos que buscam oportunidades precisam localizar plantões disponíveis perto de si.

Por meio de um cadastro verificado e de uma taxa única de acesso, médicos titulares publicam os plantões que desejam repassar e recebem candidaturas de outros profissionais interessados. O titular analisa cada candidatura, aceita a mais adequada e estabelece contato pelo WhatsApp informado no perfil. Toda a gestão de plantões, candidaturas e perfis acontece dentro da aplicação.

O projeto foi construído como uma SPA em React com autenticação e persistência de dados no Supabase, incluindo regras de acesso (RLS) diretamente no banco de dados. É voltado a médicos e instituições de saúde que precisam organizar trocas de plantão em um ambiente centralizado.

Importante: o PlantaHoje é apenas uma plataforma de conexão entre profissionais. O médico titular deve comunicar formalmente ao hospital sobre a substituição, e a plataforma não se responsabiliza por questões trabalhistas, éticas ou legais entre as partes.

## ✨ Funcionalidades

- **Página inicial (landing)** com apresentação da proposta, seção "Como funciona" e plano de acesso (taxa única de R$ 29,90).
- **Cadastro de médicos** com validação de dados (nome, e-mail, telefone/WhatsApp, cidade/estado, hospital principal e senha) e fluxo de checkout de pagamento via Hoopay.
- **Autenticação** por e-mail e senha com gestão de sessão pelo Supabase Auth (contexto `AuthProvider`).
- **Dashboard** com saudação ao médico, atalhos para buscar e anunciar plantões e indicadores (plantões disponíveis e plantões ativos).
- **Busca de plantões** com filtro por hospital ou cidade.
- **Publicação de plantões** com hospital, cidade/estado, data, horário de início e fim, valor sugerido (opcional) e descrição (opcional); validação com Zod.
- **Meus Plantões** organizados em abas *Disponíveis*, *Reservados* e *Finalizados*, com opção de cancelar o plantão.
- **Gestão de candidaturas**: o titular do plantão visualiza as candidaturas recebidas, lê a mensagem do candidato e aceita ou rejeita; ao aceitar, as demais candidaturas são rejeitadas automaticamente.
- **Detalhe do plantão** com exibição completa (hospital, localização, data, horário, valor) e formulário de candidatura com aceite obrigatório dos termos de compromisso.
- **Perfil do médico** com edição de nome, telefone, cidade/estado e hospital, além de exibição do status de pagamento.
- **Banco de dados Supabase** com tabelas `profiles`, `plantoes` e `candidaturas`, políticas de RLS e controle de status (`disponivel`, `reservado`, `concluido`, `cancelado`).

## 🛠️ Tecnologias

<p>
<img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
<img src="https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white" alt="shadcn/ui" />
<img src="https://img.shields.io/badge/React%20Router-6-CA4245?logo=reactrouter&logoColor=white" alt="React Router" />
<img src="https://img.shields.io/badge/TanStack%20Query-5-FF4154?logo=reactquery&logoColor=white" alt="TanStack Query" />
<img src="https://img.shields.io/badge/Zod-3-3E67B1?logo=zod&logoColor=white" alt="Zod" />
</p>

- **React 18** + **TypeScript** + **Vite**
- **shadcn/ui** (componentes Radix UI) e **Tailwind CSS**
- **Supabase** (autenticação, banco Postgres e RLS)
- **React Router DOM**, **TanStack React Query**
- **React Hook Form** + **Zod** para formulários e validação
- **date-fns** (formatação de datas em pt-BR), **lucide-react** e **sonner**

## 📁 Estrutura do projeto

```
shift-sure/
├── public/                      # Arquivos estáticos (favicon, robots.txt)
├── src/
│   ├── components/
│   │   ├── ui/                  # Componentes shadcn/ui
│   │   ├── Header.tsx           # Cabeçalho autenticado
│   │   ├── Logo.tsx
│   │   ├── NavLink.tsx
│   │   ├── PlantaoCard.tsx      # Card de plantão
│   │   └── TermosCompromisso.tsx
│   ├── hooks/
│   │   ├── useAuth.tsx          # Autenticação (contexto)
│   │   ├── usePlantoes.tsx      # CRUD de plantões e candidaturas
│   │   └── useProfile.tsx       # Perfil do médico
│   ├── integrations/supabase/   # Cliente Supabase
│   ├── lib/utils.ts
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Registrar.tsx
│   │   ├── Entrar.tsx
│   │   ├── Dashboard.tsx
│   │   ├── BuscarPlantoes.tsx
│   │   ├── MeusPlantoes.tsx
│   │   ├── NovoPlantao.tsx
│   │   ├── PlantaoDetalhe.tsx
│   │   ├── Perfil.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx                  # Rotas da aplicação
│   ├── index.css
│   └── main.tsx
├── supabase/
│   ├── config.toml
│   └── migrations/              # Esquema do banco e políticas de RLS
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Como rodar localmente

Pré-requisitos: **Node.js** e **npm**.

```bash
# 1. Instalar as dependências
npm install

# 2. Configurar as variáveis de ambiente (ver seção abaixo)

# 3. Iniciar o servidor de desenvolvimento (http://localhost:8080)
npm run dev
```

Scripts disponíveis:

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run preview    # Pré-visualização do build
npm run lint       # Análise estática com ESLint
```

## 🔐 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:

| Variável | Descrição |
| --- | --- |
| `VITE_SUPABASE_PROJECT_ID` | Identificador do projeto no Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública (anon) do Supabase |
| `VITE_SUPABASE_URL` | URL do projeto Supabase |

## 📄 Licença

Distribuído sob a **Licença MIT**. Veja [`LICENSE`](./LICENSE).
