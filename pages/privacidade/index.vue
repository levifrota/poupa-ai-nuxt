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
          <h1 class="text-2xl font-bold">Política de Privacidade</h1>
          <p class="mt-1 text-sm text-muted-foreground">
            Poupa.ai — Assistente de Finanças Pessoais
          </p>
          <p class="mt-1 text-sm text-muted-foreground">
            Última atualização: 31 de agosto de 2026
          </p>
        </header>

        <!-- Introdução -->
        <p class="mb-6 text-base leading-relaxed">
          A sua privacidade é importante para nós. Esta Política de Privacidade descreve como o
          <strong>Poupa.ai</strong> coleta, utiliza, armazena, compartilha e protege os seus dados
          pessoais, em conformidade com a
          <strong>Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018)</strong>
          e demais legislações aplicáveis. Ao utilizar nosso aplicativo, você declara estar ciente
          dos termos aqui descritos.
        </p>

        <!-- Índice -->
        <nav class="mb-8 rounded-lg bg-muted/50 p-4">
          <h2 class="mb-3 text-lg font-semibold">Índice</h2>
          <ol class="list-decimal space-y-1 pl-6 text-sm">
            <li><a href="#controlador" class="text-primary hover:underline">Identificação do Controlador</a></li>
            <li><a href="#dados-coletados" class="text-primary hover:underline">Dados Pessoais Coletados</a></li>
            <li><a href="#finalidade" class="text-primary hover:underline">Finalidade do Tratamento</a></li>
            <li><a href="#base-legal" class="text-primary hover:underline">Base Legal para o Tratamento</a></li>
            <li><a href="#compartilhamento" class="text-primary hover:underline">Compartilhamento de Dados</a></li>
            <li><a href="#armazenamento" class="text-primary hover:underline">Armazenamento e Segurança</a></li>
            <li><a href="#retencao" class="text-primary hover:underline">Retenção de Dados</a></li>
            <li><a href="#direitos" class="text-primary hover:underline">Direitos do Titular</a></li>
            <li><a href="#cookies" class="text-primary hover:underline">Cookies e Tecnologias de Rastreamento</a></li>
            <li><a href="#transferencia" class="text-primary hover:underline">Transferência Internacional de Dados</a></li>
            <li><a href="#alteracoes" class="text-primary hover:underline">Alterações nesta Política</a></li>
            <li><a href="#contato" class="text-primary hover:underline">Contato do Encarregado (DPO)</a></li>
          </ol>
        </nav>

        <!-- Seções -->
        <div class="space-y-8">
          <!-- 1. Identificação do Controlador -->
          <section id="controlador">
            <h2 class="text-xl font-semibold">1. Identificação do Controlador</h2>
            <p class="mt-2 text-base leading-relaxed">
              O controlador responsável pelo tratamento dos seus dados pessoais é:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li><strong>Razão Social:</strong> [RAZÃO SOCIAL]</li>
              <li><strong>CNPJ:</strong> [CNPJ]</li>
              <li><strong>Encarregado de Proteção de Dados (DPO):</strong> [EMAIL_DPO]</li>
            </ul>
          </section>

          <!-- 2. Dados Pessoais Coletados -->
          <section id="dados-coletados">
            <h2 class="text-xl font-semibold">2. Dados Pessoais Coletados</h2>
            <p class="mt-1 text-sm text-muted-foreground">(Art. 5° da LGPD)</p>
            <p class="mt-2 text-base leading-relaxed">
              O Poupa.ai coleta e trata os seguintes dados pessoais, fornecidos diretamente por
              você ou gerados pelo uso do aplicativo:
            </p>

            <h3 class="mt-4 text-lg font-medium">2.1. Dados de Identificação e Perfil</h3>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Foto de perfil (quando fornecida via conta Google)</li>
            </ul>

            <h3 class="mt-4 text-lg font-medium">2.2. Dados Financeiros</h3>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>Transações financeiras (valor, descrição, categoria e data)</li>
              <li>Contas bancárias (nome da conta e saldo)</li>
              <li>Metas de poupança (nome, valor-alvo e progresso)</li>
              <li>Orçamentos, incluindo orçamentos compartilhados com outros usuários</li>
              <li>Lembretes de contas e transações recorrentes</li>
            </ul>

            <h3 class="mt-4 text-lg font-medium">2.3. Dados de Preferências</h3>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>Preferências de tema (claro/escuro)</li>
              <li>Preferências de fonte e tamanho de texto</li>
              <li>Preferência de moeda</li>
            </ul>

            <h3 class="mt-4 text-lg font-medium">2.4. Dados de Integração com Telegram</h3>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>Nome de usuário do Telegram (username)</li>
              <li>Identificador de chat do Telegram (chat ID)</li>
            </ul>

            <h3 class="mt-4 text-lg font-medium">2.5. Dados de Uso e Navegação</h3>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>Dados de autenticação e sessão</li>
              <li>Informações de uso coletadas via Google Analytics/Firebase Analytics</li>
            </ul>
          </section>

          <!-- 3. Finalidade do Tratamento -->
          <section id="finalidade">
            <h2 class="text-xl font-semibold">3. Finalidade do Tratamento</h2>
            <p class="mt-1 text-sm text-muted-foreground">(Art. 6° e 7° da LGPD)</p>
            <p class="mt-2 text-base leading-relaxed">
              Os dados pessoais coletados são utilizados para as seguintes finalidades:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                <strong>Gestão financeira pessoal:</strong> registrar transações, gerenciar contas
                bancárias, acompanhar metas de poupança e controlar orçamentos.
              </li>
              <li>
                <strong>Geração de relatórios com inteligência artificial:</strong> utilizar o
                Google Gemini AI para gerar relatórios, análises e insights financeiros
                personalizados com base nos seus dados.
              </li>
              <li>
                <strong>Compartilhamento de orçamento:</strong> permitir que você compartilhe
                orçamentos com outros usuários do Poupa.ai.
              </li>
              <li>
                <strong>Notificações via Telegram:</strong> enviar lembretes de contas, alertas de
                transações recorrentes e outros avisos através do bot do Telegram, caso você opte
                por essa integração.
              </li>
              <li>
                <strong>Analytics e melhoria do serviço:</strong> analisar padrões de uso do
                aplicativo para melhorar a experiência do usuário, identificar problemas e
                desenvolver novas funcionalidades.
              </li>
              <li>
                <strong>Autenticação e segurança:</strong> verificar a identidade do usuário e
                proteger a conta contra acessos não autorizados.
              </li>
            </ul>
          </section>

          <!-- 4. Base Legal -->
          <section id="base-legal">
            <h2 class="text-xl font-semibold">4. Base Legal para o Tratamento</h2>
            <p class="mt-1 text-sm text-muted-foreground">(Art. 7° da LGPD)</p>
            <p class="mt-2 text-base leading-relaxed">
              O tratamento dos seus dados pessoais é fundamentado nas seguintes bases legais
              previstas na LGPD:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                <strong>Consentimento (Art. 7°, I):</strong> para o envio de notificações via
                Telegram, integração com serviços de terceiros e coleta de dados de analytics. O
                consentimento pode ser revogado a qualquer momento.
              </li>
              <li>
                <strong>Execução de contrato (Art. 7°, V):</strong> para a prestação do serviço de
                gestão financeira pessoal, incluindo o registro de transações, gerenciamento de
                contas, metas e orçamentos.
              </li>
              <li>
                <strong>Legítimo interesse (Art. 7°, IX):</strong> para melhoria contínua do
                aplicativo, análise de uso, prevenção de fraudes e garantia da segurança da
                plataforma.
              </li>
            </ul>
          </section>

          <!-- 5. Compartilhamento de Dados -->
          <section id="compartilhamento">
            <h2 class="text-xl font-semibold">5. Compartilhamento de Dados</h2>
            <p class="mt-1 text-sm text-muted-foreground">(Art. 26° da LGPD)</p>
            <p class="mt-2 text-base leading-relaxed">
              O Poupa.ai poderá compartilhar seus dados pessoais com os seguintes terceiros, sempre
              respeitando as finalidades descritas nesta política e os limites da LGPD:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                <strong>Google/Firebase:</strong> utilizado para autenticação de usuários (Firebase
                Authentication), armazenamento de dados (Cloud Firestore) e análise de uso do
                aplicativo (Firebase Analytics/Google Analytics).
              </li>
              <li>
                <strong>Google Gemini AI:</strong> dados financeiros podem ser enviados de forma
                contextual ao Google Gemini para a geração de relatórios e insights personalizados.
                Nenhum dado é utilizado pelo Google para treinar modelos de IA.
              </li>
              <li>
                <strong>Telegram:</strong> quando o usuário opta pela integração, o username e chat
                ID do Telegram são utilizados para enviar notificações e lembretes. O conteúdo das
                mensagens pode incluir informações sobre transações e lembretes financeiros.
              </li>
            </ul>
            <p class="mt-3 text-base leading-relaxed">
              <strong>Não vendemos, alugamos ou comercializamos</strong> seus dados pessoais com
              terceiros para fins de marketing, publicidade ou qualquer outra finalidade não
              descrita nesta política.
            </p>
          </section>

          <!-- 6. Armazenamento e Segurança -->
          <section id="armazenamento">
            <h2 class="text-xl font-semibold">6. Armazenamento e Segurança</h2>
            <p class="mt-2 text-base leading-relaxed">
              Seus dados pessoais são armazenados no <strong>Firebase Cloud Firestore</strong>,
              serviço de banco de dados em nuvem fornecido pelo Google. Adotamos as seguintes
              medidas de segurança para proteger seus dados:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                <strong>Criptografia em trânsito:</strong> todas as comunicações entre o seu
                dispositivo e nossos servidores são protegidas por criptografia TLS/SSL.
              </li>
              <li>
                <strong>Criptografia em repouso:</strong> os dados armazenados no Firebase Cloud
                Firestore são automaticamente criptografados em repouso.
              </li>
              <li>
                <strong>Regras de segurança:</strong> o acesso aos dados é controlado por regras
                de segurança do Firebase, garantindo que cada usuário tenha acesso apenas aos seus
                próprios dados.
              </li>
              <li>
                <strong>Autenticação segura:</strong> a autenticação é gerenciada pelo Firebase
                Authentication, que utiliza padrões de segurança reconhecidos pela indústria.
              </li>
            </ul>
          </section>

          <!-- 7. Retenção de Dados -->
          <section id="retencao">
            <h2 class="text-xl font-semibold">7. Retenção de Dados</h2>
            <p class="mt-2 text-base leading-relaxed">
              Seus dados pessoais serão mantidos pelo Poupa.ai:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                <strong>Enquanto sua conta estiver ativa</strong> e for necessário para a prestação
                dos serviços descritos nesta política.
              </li>
              <li>
                <strong>Até que você solicite a exclusão</strong> dos seus dados ou da sua conta,
                por meio dos canais de contato disponibilizados.
              </li>
              <li>
                <strong>Pelo período exigido por lei</strong> para cumprimento de obrigações
                legais, regulatórias ou para exercício regular de direitos em processos judiciais,
                administrativos ou arbitrais.
              </li>
            </ul>
            <p class="mt-3 text-base leading-relaxed">
              Após a exclusão da conta ou solicitação de eliminação, seus dados serão removidos de
              nossos sistemas em até 30 (trinta) dias, salvo quando houver obrigação legal de
              retenção.
            </p>
          </section>

          <!-- 8. Direitos do Titular -->
          <section id="direitos">
            <h2 class="text-xl font-semibold">8. Direitos do Titular</h2>
            <p class="mt-1 text-sm text-muted-foreground">(Art. 18° da LGPD)</p>
            <p class="mt-2 text-base leading-relaxed">
              Como titular dos dados pessoais, você tem os seguintes direitos, que podem ser
              exercidos a qualquer momento mediante solicitação ao nosso Encarregado de Proteção de
              Dados (DPO):
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                <strong>Confirmação e acesso:</strong> confirmar a existência de tratamento e
                obter acesso aos seus dados pessoais.
              </li>
              <li>
                <strong>Correção:</strong> solicitar a correção de dados pessoais incompletos,
                inexatos ou desatualizados.
              </li>
              <li>
                <strong>Anonimização, bloqueio ou eliminação:</strong> solicitar a anonimização,
                bloqueio ou eliminação de dados pessoais desnecessários, excessivos ou tratados em
                desconformidade com a LGPD.
              </li>
              <li>
                <strong>Portabilidade:</strong> solicitar a portabilidade dos seus dados pessoais
                a outro fornecedor de serviço, mediante requisição expressa.
              </li>
              <li>
                <strong>Eliminação:</strong> solicitar a eliminação dos dados pessoais tratados
                com base no seu consentimento.
              </li>
              <li>
                <strong>Informação sobre compartilhamento:</strong> obter informações sobre as
                entidades públicas e privadas com as quais seus dados foram compartilhados.
              </li>
              <li>
                <strong>Revogação do consentimento:</strong> revogar o consentimento previamente
                concedido, a qualquer momento, sem comprometer a licitude do tratamento realizado
                anteriormente.
              </li>
            </ul>
            <p class="mt-3 text-base leading-relaxed">
              Para exercer qualquer um desses direitos, entre em contato com nosso DPO pelo e-mail
              <strong>[EMAIL_DPO]</strong>. Responderemos à sua solicitação em até 15 (quinze)
              dias úteis, conforme previsto na legislação.
            </p>
          </section>

          <!-- 9. Cookies e Tecnologias de Rastreamento -->
          <section id="cookies">
            <h2 class="text-xl font-semibold">9. Cookies e Tecnologias de Rastreamento</h2>
            <p class="mt-2 text-base leading-relaxed">
              O Poupa.ai utiliza cookies e tecnologias semelhantes para melhorar a sua experiência.
              Os tipos de cookies utilizados são:
            </p>

            <h3 class="mt-4 text-lg font-medium">9.1. Cookies Essenciais</h3>
            <p class="mt-1 text-base leading-relaxed">
              Necessários para o funcionamento básico do aplicativo. Incluem:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>Cookies de sessão e autenticação (Firebase Authentication)</li>
              <li>Cookies de segurança e proteção contra fraudes</li>
            </ul>

            <h3 class="mt-4 text-lg font-medium">9.2. Cookies de Analytics</h3>
            <p class="mt-1 text-base leading-relaxed">
              Utilizados para coletar informações sobre como o aplicativo é utilizado, permitindo
              melhorias contínuas. Incluem:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>Google Analytics via Firebase (coleta de dados de uso, páginas visitadas,
                tempo de sessão e interações)</li>
            </ul>

            <h3 class="mt-4 text-lg font-medium">9.3. Armazenamento Local (localStorage)</h3>
            <p class="mt-1 text-base leading-relaxed">
              Utilizamos o armazenamento local do navegador para salvar suas preferências, como:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>Preferência de tema (claro/escuro)</li>
              <li>Preferências de fonte e moeda</li>
              <li>Outras configurações de personalização da interface</li>
            </ul>
          </section>

          <!-- 10. Transferência Internacional -->
          <section id="transferencia">
            <h2 class="text-xl font-semibold">10. Transferência Internacional de Dados</h2>
            <p class="mt-1 text-sm text-muted-foreground">(Art. 33° da LGPD)</p>
            <p class="mt-2 text-base leading-relaxed">
              Os seus dados pessoais podem ser transferidos e armazenados em servidores localizados
              fora do Brasil, especificamente nos Estados Unidos da América, onde estão localizados
              os servidores do Google/Firebase. Essa transferência internacional ocorre com base
              nos seguintes mecanismos de proteção:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                O Google adota cláusulas contratuais padrão e políticas de privacidade que
                garantem nível de proteção de dados equivalente ao exigido pela LGPD.
              </li>
              <li>
                O Google está em conformidade com frameworks internacionais de proteção de dados,
                incluindo certificações de segurança reconhecidas (ISO 27001, SOC 2).
              </li>
              <li>
                Os dados são protegidos por criptografia em trânsito e em repouso, conforme
                descrito na seção de Armazenamento e Segurança.
              </li>
            </ul>
          </section>

          <!-- 11. Alterações na Política -->
          <section id="alteracoes">
            <h2 class="text-xl font-semibold">11. Alterações nesta Política</h2>
            <p class="mt-2 text-base leading-relaxed">
              O Poupa.ai reserva-se o direito de alterar esta Política de Privacidade a qualquer
              momento, para adequá-la a novas exigências legais, regulatórias ou a mudanças no
              aplicativo. Em caso de alterações relevantes:
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li>
                Notificaremos você por meio do aplicativo ou por e-mail antes que as alterações
                entrem em vigor.
              </li>
              <li>
                A data de "Última atualização" no topo desta página será atualizada para refletir
                a versão mais recente.
              </li>
              <li>
                O uso continuado do aplicativo após a notificação de alterações será considerado
                como aceitação dos novos termos.
              </li>
            </ul>
            <p class="mt-3 text-base leading-relaxed">
              Recomendamos que você revise esta política periodicamente para se manter informado
              sobre como protegemos seus dados.
            </p>
          </section>

          <!-- 12. Contato do DPO -->
          <section id="contato">
            <h2 class="text-xl font-semibold">12. Contato do Encarregado (DPO)</h2>
            <p class="mt-2 text-base leading-relaxed">
              Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de
              Privacidade ou ao tratamento dos seus dados pessoais, entre em contato com o nosso
              Encarregado de Proteção de Dados (DPO):
            </p>
            <ul class="mt-2 list-disc pl-6 text-base leading-relaxed">
              <li><strong>E-mail:</strong> [EMAIL_DPO]</li>
              <li><strong>Controlador:</strong> [RAZÃO SOCIAL]</li>
              <li><strong>CNPJ:</strong> [CNPJ]</li>
            </ul>
            <p class="mt-3 text-base leading-relaxed">
              Você também tem o direito de registrar reclamação junto à
              <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong>, caso considere que
              o tratamento dos seus dados pessoais viola a LGPD.
            </p>
          </section>
        </div>

        <!-- Rodapé do documento -->
        <footer class="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            © 2026 Poupa.ai — Todos os direitos reservados.
          </p>
          <p class="mt-1">
            Este documento foi elaborado em conformidade com a Lei Geral de Proteção de Dados
            Pessoais (Lei nº 13.709/2018).
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
  title: "Política de Privacidade — Poupa.ai",
  meta: [
    {
      name: "description",
      content:
        "Política de Privacidade do Poupa.ai. Saiba como coletamos, utilizamos e protegemos seus dados pessoais em conformidade com a LGPD.",
    },
  ],
});
</script>
