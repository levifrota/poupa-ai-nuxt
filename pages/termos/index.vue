<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="container mx-auto max-w-3xl p-6">
      <!-- Voltar -->
      <NuxtLink
        to="/login"
        class="mb-6 inline-flex items-center text-sm font-medium text-primary hover:underline"
      >
        ← Voltar
      </NuxtLink>

      <article class="bg-card rounded-lg p-6 shadow-sm">
        <!-- Header -->
        <header class="mb-8 border-b border-border pb-6">
          <h1 class="text-2xl font-bold">Termos de Uso e Responsabilidade</h1>
          <p class="mt-1 text-sm text-muted-foreground">
            Poupa.ai — Assistente de Finanças Pessoais
          </p>
          <p class="mt-1 text-sm text-muted-foreground">
            Última atualização: 31 de agosto de 2026
          </p>
        </header>

        <!-- Introdução -->
        <p class="mb-6 text-base leading-relaxed">
          Bem-vindo ao <strong>Poupa.ai</strong>! Estes Termos de Uso e Responsabilidade
          ("Termos") regulam o acesso e a utilização do aplicativo Poupa.ai, um assistente de
          finanças pessoais desenvolvido por <strong>[RAZÃO SOCIAL]</strong>, inscrita no CNPJ
          sob o nº <strong>[CNPJ]</strong>. Ao acessar ou utilizar o Poupa.ai, você declara que
          leu, compreendeu e concorda com todos os termos e condições aqui descritos. Caso não
          concorde com qualquer disposição, não utilize o serviço.
        </p>

        <!-- Índice -->
        <nav class="mb-8 rounded-lg bg-muted/50 p-4">
          <h2 class="mb-3 text-lg font-semibold">Índice</h2>
          <ol class="list-decimal space-y-1 pl-6 text-sm">
            <li><a href="#aceitacao" class="text-primary hover:underline">Aceitação dos Termos</a></li>
            <li><a href="#descricao" class="text-primary hover:underline">Descrição do Serviço</a></li>
            <li><a href="#cadastro" class="text-primary hover:underline">Cadastro e Conta</a></li>
            <li><a href="#responsabilidades" class="text-primary hover:underline">Responsabilidades do Usuário</a></li>
            <li><a href="#limitacao" class="text-primary hover:underline">Limitação de Responsabilidade</a></li>
            <li><a href="#propriedade" class="text-primary hover:underline">Propriedade Intelectual</a></li>
            <li><a href="#disponibilidade" class="text-primary hover:underline">Disponibilidade do Serviço</a></li>
            <li><a href="#planos" class="text-primary hover:underline">Planos e Pagamentos</a></li>
            <li><a href="#compartilhados" class="text-primary hover:underline">Orçamentos Compartilhados</a></li>
            <li><a href="#suspensao" class="text-primary hover:underline">Suspensão e Encerramento</a></li>
            <li><a href="#integracoes" class="text-primary hover:underline">Integrações com Terceiros</a></li>
            <li><a href="#alteracoes" class="text-primary hover:underline">Alterações nos Termos</a></li>
            <li><a href="#disposicoes" class="text-primary hover:underline">Disposições Gerais</a></li>
            <li><a href="#contato" class="text-primary hover:underline">Contato</a></li>
          </ol>
        </nav>

        <!-- Seções -->
        <div class="space-y-8">
          <!-- 1. Aceitação dos Termos -->
          <section id="aceitacao">
            <h2 class="text-xl font-semibold">1. Aceitação dos Termos</h2>
            <p class="mt-2 text-base leading-relaxed">
              Ao criar uma conta, acessar ou utilizar o Poupa.ai de qualquer forma, você declara
              que leu, compreendeu e aceita integralmente estes Termos de Uso e Responsabilidade,
              bem como a nossa
              <NuxtLink to="/privacidade" class="text-primary hover:underline">
                Política de Privacidade</NuxtLink>.
              Estes Termos constituem um acordo legal vinculante entre você ("Usuário") e o
              Poupa.ai.
            </p>
            <p class="mt-3 text-base leading-relaxed">
              Se você não concordar com qualquer disposição destes Termos, não deverá criar uma
              conta nem utilizar o serviço. O uso continuado do aplicativo após a publicação de
              alterações nestes Termos constitui aceitação tácita das novas condições.
            </p>
            <p class="mt-3 text-base leading-relaxed">
              Para utilizar o Poupa.ai, você declara ter pelo menos 18 (dezoito) anos de idade
              ou a idade mínima exigida pela legislação aplicável, e possuir capacidade civil
              plena para aceitar estes Termos.
            </p>
          </section>

          <!-- 2. Descrição do Serviço -->
          <section id="descricao">
            <h2 class="text-xl font-semibold">2. Descrição do Serviço</h2>
            <p class="mt-2 text-base leading-relaxed">
              O <strong>Poupa.ai</strong> é um assistente de finanças pessoais que auxilia os
              usuários na organização e no acompanhamento da sua vida financeira. O aplicativo
              oferece as seguintes funcionalidades principais:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                <strong>Registro de transações financeiras:</strong> cadastro de receitas e
                despesas, com categorização, descrição, data e valor.
              </li>
              <li>
                <strong>Gerenciamento de contas:</strong> criação e acompanhamento de contas
                bancárias, carteiras digitais e outras contas financeiras, incluindo saldos.
              </li>
              <li>
                <strong>Metas de poupança:</strong> definição de objetivos financeiros com
                valor-alvo e acompanhamento de progresso.
              </li>
              <li>
                <strong>Orçamentos individuais e compartilhados:</strong> criação de orçamentos
                mensais por categoria, com possibilidade de compartilhá-los com outros usuários
                do Poupa.ai.
              </li>
              <li>
                <strong>Relatórios gerados por inteligência artificial:</strong> relatórios,
                análises e insights financeiros personalizados gerados pelo Google Gemini AI, com
                base nos dados financeiros do usuário.
              </li>
              <li>
                <strong>Notificações via Telegram:</strong> envio de lembretes de contas a pagar,
                alertas de transações recorrentes e outros avisos financeiros por meio de um bot
                integrado ao Telegram.
              </li>
              <li>
                <strong>Acompanhamento de contas a pagar:</strong> controle de contas e
                compromissos financeiros futuros, com lembretes e alertas de vencimento.
              </li>
              <li>
                <strong>Transações recorrentes:</strong> cadastro de transações que se repetem
                periodicamente, com geração automática.
              </li>
            </ul>
            <p class="mt-3 text-base leading-relaxed">
              O Poupa.ai reserva-se o direito de adicionar, modificar ou descontinuar
              funcionalidades a qualquer momento, mediante aviso prévio aos usuários quando
              aplicável.
            </p>
          </section>

          <!-- 3. Cadastro e Conta -->
          <section id="cadastro">
            <h2 class="text-xl font-semibold">3. Cadastro e Conta</h2>

            <h3 class="mt-4 text-lg font-medium">3.1. Requisitos para Cadastro</h3>
            <p class="mt-2 text-base leading-relaxed">
              Para utilizar o Poupa.ai, você deve criar uma conta fornecendo informações
              verdadeiras, completas e atualizadas. O cadastro pode ser realizado por meio de
              autenticação via Google (Google Sign-In) ou por e-mail e senha. Ao se cadastrar,
              você se compromete a:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>Fornecer dados verdadeiros, exatos e atualizados;</li>
              <li>Manter seus dados cadastrais sempre atualizados;</li>
              <li>
                Criar e manter uma senha segura (quando aplicável), não compartilhando-a com
                terceiros;
              </li>
              <li>Não criar contas em nome de terceiros sem a devida autorização.</li>
            </ul>

            <h3 class="mt-4 text-lg font-medium">3.2. Responsabilidade pela Conta</h3>
            <p class="mt-2 text-base leading-relaxed">
              Você é integralmente responsável por todas as atividades realizadas em sua conta.
              Caso identifique qualquer uso não autorizado, acesso indevido ou violação de
              segurança, deverá notificar o Poupa.ai imediatamente pelo e-mail
              <strong>[EMAIL_DPO]</strong>. O Poupa.ai não se responsabiliza por perdas ou danos
              decorrentes do uso não autorizado de sua conta.
            </p>
          </section>

          <!-- 4. Responsabilidades do Usuário -->
          <section id="responsabilidades">
            <h2 class="text-xl font-semibold">4. Responsabilidades do Usuário</h2>
            <p class="mt-2 text-base leading-relaxed">
              Ao utilizar o Poupa.ai, o Usuário se compromete a:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                <strong>Veracidade das informações:</strong> inserir dados financeiros e pessoais
                verdadeiros e precisos. A qualidade dos relatórios e insights gerados pela IA
                depende diretamente da precisão dos dados fornecidos pelo Usuário.
              </li>
              <li>
                <strong>Uso lícito:</strong> utilizar o aplicativo exclusivamente para fins
                lícitos, em conformidade com a legislação brasileira vigente, estes Termos e
                quaisquer outras políticas do Poupa.ai.
              </li>
              <li>
                <strong>Proteção de credenciais:</strong> não compartilhar suas credenciais de
                acesso (e-mail, senha, tokens de autenticação) com terceiros, sendo o único
                responsável pela segurança de sua conta.
              </li>
              <li>
                <strong>Não interferência:</strong> não tentar acessar contas de outros usuários,
                não interferir no funcionamento do aplicativo e não realizar engenharia reversa,
                descompilação ou desmontagem do software.
              </li>
              <li>
                <strong>Uso responsável de orçamentos compartilhados:</strong> ao compartilhar
                orçamentos com outros usuários, garantir que possui o consentimento necessário
                para expor informações financeiras a terceiros.
              </li>
              <li>
                <strong>Respeito aos outros usuários:</strong> não utilizar o recurso de
                compartilhamento para fins abusivos, assédio ou qualquer conduta contrária à
                boa-fé.
              </li>
            </ul>
          </section>

          <!-- 5. Limitação de Responsabilidade -->
          <section id="limitacao">
            <h2 class="text-xl font-semibold">5. Limitação de Responsabilidade</h2>
            <p class="mt-1 text-sm text-muted-foreground">(Art. 43° do CDC; Art. 927° do Código Civil)</p>

            <!-- Callout de aviso -->
            <div class="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
              <p class="mb-3 text-base font-semibold">
                ⚠️ Aviso Importante — Leia com Atenção
              </p>
              <ul class="list-disc pl-6 text-base leading-relaxed">
                <li>
                  O <strong>Poupa.ai NÃO é uma instituição financeira</strong>, não sendo
                  regulamentado pelo Banco Central do Brasil, pela Comissão de Valores Mobiliários
                  (CVM) ou por qualquer outro órgão regulador do sistema financeiro.
                </li>
                <li>
                  O Poupa.ai <strong>NÃO oferece aconselhamento financeiro, de investimento ou
                  fiscal</strong>. Nenhuma informação presente no aplicativo deve ser interpretada
                  como recomendação de investimento, planejamento tributário ou consultoria
                  financeira profissional.
                </li>
                <li>
                  Os <strong>relatórios e insights gerados pela inteligência artificial
                  (Google Gemini AI) são meramente informativos</strong> e não constituem
                  recomendação, conselho ou orientação financeira. Tais relatórios são gerados
                  automaticamente com base nos dados fornecidos pelo Usuário e podem conter
                  imprecisões.
                </li>
                <li>
                  O <strong>Usuário é o único responsável por suas próprias decisões
                  financeiras</strong>. Recomendamos que consulte profissionais qualificados
                  (contadores, planejadores financeiros, consultores de investimento) antes de
                  tomar decisões financeiras relevantes.
                </li>
                <li>
                  O Poupa.ai <strong>não se responsabiliza por perdas financeiras, danos diretos,
                  indiretos, incidentais ou consequenciais</strong> que possam resultar do uso
                  das informações, relatórios ou funcionalidades disponibilizadas pelo aplicativo.
                </li>
              </ul>
            </div>

            <h3 class="mt-4 text-lg font-medium">5.1. Serviço Fornecido "Como Está"</h3>
            <p class="mt-2 text-base leading-relaxed">
              O Poupa.ai é fornecido <strong>"como está" (as is)</strong> e
              <strong>"conforme disponível" (as available)</strong>, sem garantias de qualquer
              natureza, expressas ou implícitas, incluindo, mas não se limitando a, garantias de
              comercialidade, adequação a uma finalidade específica e não violação de direitos de
              terceiros.
            </p>

            <h3 class="mt-4 text-lg font-medium">5.2. Limitação de Indenização</h3>
            <p class="mt-2 text-base leading-relaxed">
              Na máxima extensão permitida pela legislação brasileira, a responsabilidade total
              do Poupa.ai e de seus representantes, em qualquer hipótese, estará limitada ao
              valor efetivamente pago pelo Usuário nos 12 (doze) meses anteriores ao evento que
              deu origem à reclamação, ou, no caso de serviços gratuitos, a responsabilidade será
              limitada ao mínimo legal aplicável.
            </p>
          </section>

          <!-- 6. Propriedade Intelectual -->
          <section id="propriedade">
            <h2 class="text-xl font-semibold">6. Propriedade Intelectual</h2>
            <p class="mt-1 text-sm text-muted-foreground">(Lei nº 9.610/1998 — Direitos Autorais; Lei nº 9.279/1996 — Propriedade Industrial)</p>

            <h3 class="mt-4 text-lg font-medium">6.1. Direitos do Poupa.ai</h3>
            <p class="mt-2 text-base leading-relaxed">
              Todos os direitos de propriedade intelectual relativos ao Poupa.ai, incluindo, mas
              não se limitando a, marca, logotipo, design, interface, código-fonte, textos,
              gráficos, ícones e demais elementos visuais e funcionais do aplicativo, são de
              titularidade exclusiva do <strong>[RAZÃO SOCIAL]</strong> ou de seus licenciadores,
              sendo protegidos pela legislação brasileira e internacional de propriedade
              intelectual.
            </p>
            <p class="mt-3 text-base leading-relaxed">
              O Usuário não está autorizado a copiar, modificar, distribuir, vender, alugar,
              sublicenciar, descompilar, fazer engenharia reversa ou criar obras derivadas do
              aplicativo ou de qualquer parte dele, salvo quando expressamente autorizado por
              escrito.
            </p>

            <h3 class="mt-4 text-lg font-medium">6.2. Dados do Usuário</h3>
            <p class="mt-2 text-base leading-relaxed">
              Os dados pessoais e financeiros inseridos pelo Usuário no Poupa.ai permanecem de
              titularidade do próprio Usuário. O Poupa.ai não reivindica qualquer direito de
              propriedade sobre os dados do Usuário, utilizando-os exclusivamente para a
              prestação do serviço e conforme descrito na
              <NuxtLink to="/privacidade" class="text-primary hover:underline">
                Política de Privacidade</NuxtLink>.
            </p>
          </section>

          <!-- 7. Disponibilidade do Serviço -->
          <section id="disponibilidade">
            <h2 class="text-xl font-semibold">7. Disponibilidade do Serviço</h2>
            <p class="mt-2 text-base leading-relaxed">
              O Poupa.ai empenha-se em manter o serviço disponível de forma contínua e estável.
              No entanto, <strong>não garantimos disponibilidade ininterrupta (100% de
              uptime)</strong> do aplicativo. O serviço poderá ficar temporariamente
              indisponível em razão de:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                <strong>Manutenções programadas:</strong> atualizações, correções e melhorias no
                sistema, que serão comunicadas previamente sempre que possível.
              </li>
              <li>
                <strong>Manutenções emergenciais:</strong> correções de segurança ou falhas
                críticas que necessitem de intervenção imediata.
              </li>
              <li>
                <strong>Eventos de força maior:</strong> falhas em serviços de terceiros
                (Firebase, Google Cloud, Telegram), desastres naturais, interrupções de energia,
                falhas de rede ou outras circunstâncias fora do controle do Poupa.ai.
              </li>
            </ul>
            <p class="mt-3 text-base leading-relaxed">
              O Poupa.ai não será responsável por quaisquer perdas ou danos decorrentes da
              indisponibilidade temporária do serviço.
            </p>
          </section>

          <!-- 8. Planos e Pagamentos -->
          <section id="planos">
            <h2 class="text-xl font-semibold">8. Planos e Pagamentos</h2>

            <h3 class="mt-4 text-lg font-medium">8.1. Plano Gratuito</h3>
            <p class="mt-2 text-base leading-relaxed">
              Atualmente, o Poupa.ai oferece um <strong>plano gratuito</strong> que permite o
              acesso às funcionalidades básicas do aplicativo. O plano gratuito pode ter
              limitações em relação ao número de funcionalidades disponíveis, que serão
              informadas dentro do próprio aplicativo.
            </p>

            <h3 class="mt-4 text-lg font-medium">8.2. Plano Premium</h3>
            <p class="mt-2 text-base leading-relaxed">
              O Poupa.ai planeja oferecer em breve um <strong>plano Premium</strong> com
              funcionalidades adicionais e recursos avançados. Quando disponível, os seguintes
              termos se aplicarão:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                <strong>Cobrança:</strong> o valor, a periodicidade (mensal ou anual) e os meios
                de pagamento aceitos serão informados na página de assinatura do aplicativo antes
                da contratação.
              </li>
              <li>
                <strong>Renovação automática:</strong> as assinaturas poderão ser renovadas
                automaticamente ao final de cada período, salvo cancelamento prévio pelo Usuário.
              </li>
              <li>
                <strong>Cancelamento:</strong> o Usuário poderá cancelar a assinatura Premium a
                qualquer momento. O cancelamento será efetivado ao final do período de cobrança
                vigente, sem direito a reembolso proporcional, salvo disposição legal em
                contrário.
              </li>
              <li>
                <strong>Direito de arrependimento:</strong> em conformidade com o Art. 49 do
                Código de Defesa do Consumidor, o Usuário poderá desistir da contratação no prazo
                de 7 (sete) dias a contar da assinatura, com direito ao reembolso integral.
              </li>
              <li>
                <strong>Alteração de preços:</strong> o Poupa.ai reserva-se o direito de alterar
                os preços dos planos, mediante aviso prévio de 30 (trinta) dias. As alterações
                de preço não afetarão o período de assinatura em vigor.
              </li>
            </ul>
          </section>

          <!-- 9. Orçamentos Compartilhados -->
          <section id="compartilhados">
            <h2 class="text-xl font-semibold">9. Orçamentos Compartilhados</h2>
            <p class="mt-2 text-base leading-relaxed">
              O Poupa.ai permite que os Usuários compartilhem orçamentos com outros usuários
              cadastrados na plataforma. Ao utilizar a funcionalidade de orçamentos
              compartilhados, o Usuário reconhece e concorda que:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                <strong>Compartilhamento voluntário:</strong> ao convidar outro usuário para
                compartilhar um orçamento, o Usuário está voluntariamente compartilhando
                informações financeiras (valores, categorias, transações vinculadas ao orçamento)
                com o outro participante.
              </li>
              <li>
                <strong>Responsabilidade pelo compartilhamento:</strong> o Poupa.ai não se
                responsabiliza pelo uso que o outro participante fará das informações financeiras
                compartilhadas. A decisão de compartilhar dados financeiros é de inteira
                responsabilidade do Usuário.
              </li>
              <li>
                <strong>Gestão de acesso:</strong> o Usuário que criou o orçamento compartilhado
                poderá revogar o acesso de qualquer participante a qualquer momento.
              </li>
              <li>
                <strong>Confiança e boa-fé:</strong> os Usuários que participam de orçamentos
                compartilhados devem agir com boa-fé, inserindo informações verdadeiras e
                respeitando a privacidade dos demais participantes.
              </li>
              <li>
                <strong>Proteção de dados de terceiros:</strong> o Usuário não deve inserir dados
                pessoais de terceiros que não sejam participantes do orçamento compartilhado sem
                o devido consentimento.
              </li>
            </ul>
          </section>

          <!-- 10. Suspensão e Encerramento -->
          <section id="suspensao">
            <h2 class="text-xl font-semibold">10. Suspensão e Encerramento</h2>

            <h3 class="mt-4 text-lg font-medium">10.1. Suspensão pelo Poupa.ai</h3>
            <p class="mt-2 text-base leading-relaxed">
              O Poupa.ai reserva-se o direito de suspender ou cancelar a conta do Usuário, a seu
              exclusivo critério, sem aviso prévio, nas seguintes hipóteses:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>Violação de qualquer disposição destes Termos de Uso;</li>
              <li>Uso do aplicativo para fins ilícitos ou fraudulentos;</li>
              <li>Prática de atividades que comprometam a segurança, estabilidade ou integridade do aplicativo;</li>
              <li>Tentativa de acesso não autorizado a contas de outros usuários ou a sistemas internos do Poupa.ai;</li>
              <li>Compartilhamento de conteúdo ofensivo, difamatório ou que viole direitos de terceiros;</li>
              <li>Inatividade prolongada da conta, conforme critérios estabelecidos pelo Poupa.ai.</li>
            </ul>

            <h3 class="mt-4 text-lg font-medium">10.2. Exclusão pelo Usuário</h3>
            <p class="mt-2 text-base leading-relaxed">
              O Usuário poderá solicitar a exclusão de sua conta a qualquer momento, por meio das
              configurações do aplicativo ou pelo e-mail <strong>[EMAIL_DPO]</strong>. Ao
              solicitar a exclusão da conta:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                Todos os dados pessoais e financeiros do Usuário serão eliminados de nossos
                sistemas em até 30 (trinta) dias, salvo quando houver obrigação legal de
                retenção;
              </li>
              <li>
                O acesso a orçamentos compartilhados criados pelo Usuário será transferido para
                o próximo participante ou encerrado;
              </li>
              <li>
                A exclusão é irreversível — os dados não poderão ser recuperados após o
                processamento da solicitação;
              </li>
              <li>
                Eventuais assinaturas ativas deverão ser canceladas previamente pelo Usuário.
              </li>
            </ul>
          </section>

          <!-- 11. Integrações com Terceiros -->
          <section id="integracoes">
            <h2 class="text-xl font-semibold">11. Integrações com Terceiros</h2>
            <p class="mt-2 text-base leading-relaxed">
              O Poupa.ai integra-se com serviços de terceiros para oferecer suas funcionalidades.
              Ao utilizar essas integrações, o Usuário reconhece que cada serviço possui seus
              próprios termos de uso e políticas de privacidade:
            </p>

            <h3 class="mt-4 text-lg font-medium">11.1. Google (Firebase)</h3>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                <strong>Firebase Authentication:</strong> utilizado para autenticação segura de
                usuários, incluindo login com conta Google.
              </li>
              <li>
                <strong>Cloud Firestore:</strong> utilizado para armazenamento dos dados do
                Usuário em nuvem.
              </li>
              <li>
                <strong>Firebase Analytics / Google Analytics:</strong> utilizado para coleta de
                dados de uso e análise de comportamento para melhoria do aplicativo.
              </li>
              <li>
                Termos do Google:
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline"
                >
                  https://policies.google.com/terms
                </a>
              </li>
            </ul>

            <h3 class="mt-4 text-lg font-medium">11.2. Google Gemini AI</h3>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                Utilizado para gerar relatórios financeiros, análises e insights personalizados
                com base nos dados do Usuário.
              </li>
              <li>
                Os dados enviados ao Gemini são utilizados exclusivamente para gerar as respostas
                solicitadas e não são usados pelo Google para treinar modelos de IA.
              </li>
              <li>
                Os resultados gerados pela IA são meramente informativos e não constituem
                recomendação financeira, conforme detalhado na Seção 5.
              </li>
            </ul>

            <h3 class="mt-4 text-lg font-medium">11.3. Telegram</h3>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                O Poupa.ai oferece integração opcional com o Telegram para envio de notificações,
                lembretes e alertas financeiros.
              </li>
              <li>
                Para utilizar esta integração, o Usuário deve vincular seu username e chat ID do
                Telegram ao Poupa.ai.
              </li>
              <li>
                O Usuário pode desativar a integração com o Telegram a qualquer momento por meio
                das configurações do aplicativo.
              </li>
              <li>
                Termos do Telegram:
                <a
                  href="https://telegram.org/tos"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline"
                >
                  https://telegram.org/tos
                </a>
              </li>
            </ul>

            <p class="mt-3 text-base leading-relaxed">
              O Poupa.ai não se responsabiliza por ações, omissões, falhas ou alterações nos
              serviços de terceiros que possam impactar o funcionamento do aplicativo.
            </p>
          </section>

          <!-- 12. Alterações nos Termos -->
          <section id="alteracoes">
            <h2 class="text-xl font-semibold">12. Alterações nos Termos</h2>
            <p class="mt-2 text-base leading-relaxed">
              O Poupa.ai reserva-se o direito de alterar, modificar ou atualizar estes Termos de
              Uso a qualquer momento, para adequá-los a novas exigências legais, regulatórias ou
              a mudanças nas funcionalidades do aplicativo.
            </p>
            <p class="mt-3 text-base leading-relaxed">
              Em caso de alterações relevantes:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                <strong>Notificação prévia:</strong> os Usuários serão notificados sobre as
                alterações por meio do aplicativo, e-mail ou notificação via Telegram (quando
                aplicável), com antecedência mínima razoável antes de sua entrada em vigor.
              </li>
              <li>
                <strong>Atualização da data:</strong> a data de "Última atualização" no topo
                deste documento será modificada para refletir a versão mais recente.
              </li>
              <li>
                <strong>Aceitação tácita:</strong> o uso continuado do aplicativo após a
                notificação de alterações constitui aceitação dos novos termos. Caso o Usuário
                não concorde com as alterações, deverá cessar o uso do aplicativo e, se desejar,
                solicitar a exclusão de sua conta.
              </li>
            </ul>
            <p class="mt-3 text-base leading-relaxed">
              Recomendamos que você revise estes Termos periodicamente para se manter informado
              sobre as condições de uso do Poupa.ai.
            </p>
          </section>

          <!-- 13. Disposições Gerais -->
          <section id="disposicoes">
            <h2 class="text-xl font-semibold">13. Disposições Gerais</h2>

            <h3 class="mt-4 text-lg font-medium">13.1. Legislação Aplicável</h3>
            <p class="mt-2 text-base leading-relaxed">
              Estes Termos de Uso são regidos e interpretados de acordo com a legislação da
              República Federativa do Brasil, incluindo, mas não se limitando a:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD);</li>
              <li>Marco Civil da Internet (Lei nº 12.965/2014);</li>
              <li>Código de Defesa do Consumidor (Lei nº 8.078/1990 — CDC);</li>
              <li>Código Civil Brasileiro (Lei nº 10.406/2002).</li>
            </ul>

            <h3 class="mt-4 text-lg font-medium">13.2. Foro</h3>
            <p class="mt-2 text-base leading-relaxed">
              Fica eleito o foro da comarca de <strong>[CIDADE/ESTADO]</strong>, Brasil, como
              competente para dirimir quaisquer litígios ou controvérsias decorrentes destes
              Termos, com renúncia de qualquer outro, por mais privilegiado que seja.
            </p>

            <h3 class="mt-4 text-lg font-medium">13.3. Independência das Cláusulas</h3>
            <p class="mt-2 text-base leading-relaxed">
              Caso qualquer disposição destes Termos seja considerada inválida, nula ou
              inexequível por decisão judicial ou administrativa, as demais disposições
              permanecerão em pleno vigor e efeito.
            </p>

            <h3 class="mt-4 text-lg font-medium">13.4. Tolerância</h3>
            <p class="mt-2 text-base leading-relaxed">
              A eventual tolerância do Poupa.ai quanto ao descumprimento de qualquer obrigação
              prevista nestes Termos não constituirá renúncia ao direito de exigir o cumprimento
              da obrigação, nem novação ou alteração das condições aqui pactuadas.
            </p>

            <h3 class="mt-4 text-lg font-medium">13.5. Integralidade</h3>
            <p class="mt-2 text-base leading-relaxed">
              Estes Termos de Uso, juntamente com a
              <NuxtLink to="/privacidade" class="text-primary hover:underline">
                Política de Privacidade</NuxtLink>,
              constituem o acordo integral entre o Usuário e o Poupa.ai, substituindo quaisquer
              acordos, entendimentos ou negociações anteriores sobre o assunto.
            </p>
          </section>

          <!-- 14. Contato -->
          <section id="contato">
            <h2 class="text-xl font-semibold">14. Contato</h2>
            <p class="mt-2 text-base leading-relaxed">
              Se você tiver dúvidas, preocupações ou solicitações relacionadas a estes Termos de
              Uso, entre em contato conosco:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li><strong>E-mail:</strong> [EMAIL_DPO]</li>
              <li><strong>Razão Social:</strong> [RAZÃO SOCIAL]</li>
              <li><strong>CNPJ:</strong> [CNPJ]</li>
            </ul>
            <p class="mt-3 text-base leading-relaxed">
              Para questões relacionadas à privacidade e proteção de dados pessoais, consulte
              também a nossa
              <NuxtLink to="/privacidade" class="text-primary hover:underline">
                Política de Privacidade</NuxtLink>.
            </p>
          </section>
        </div>

        <!-- Rodapé do documento -->
        <footer class="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            © 2026 Poupa.ai — Todos os direitos reservados.
          </p>
          <p class="mt-1">
            Este documento foi elaborado em conformidade com a legislação brasileira, incluindo
            a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), o Código de Defesa
            do Consumidor (Lei nº 8.078/1990) e o Marco Civil da Internet (Lei nº 12.965/2014).
          </p>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

useHead({
  title: "Termos de Uso e Responsabilidade — Poupa.ai",
  meta: [
    {
      name: "description",
      content:
        "Termos de Uso e Responsabilidade do Poupa.ai. Conheça as regras, direitos e obrigações para o uso do nosso assistente de finanças pessoais.",
    },
  ],
});
</script>
