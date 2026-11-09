import { Link } from "react-router-dom";

import Headers from "./Headers.jsx";
import Footer from "./Footer";

import "../styles/TermsUseScreen.css";

export default function TermsUseScreen() {
  return (
    <div className="terms-page">
      <Headers />

      <main>
        <section className="terms-hero">
          <div className="terms-hero-content">
            <span className="terms-badge">
              Vagas Nordestinas
            </span>

            <h1>Termos de Uso</h1>

            <p>
              Regras e condições para utilização da plataforma
              Vagas Nordestinas.
            </p>
          </div>
        </section>

        <div className="terms-container">
          <div className="terms-update">
            <strong>Última atualização:</strong>{" "}
            22 de setembro de 2026.
          </div>

          <section className="terms-card">
            <h2>1. Aceitação dos Termos</h2>

            <p>
              Ao acessar, criar uma conta ou utilizar funcionalidades
              do Vagas Nordestinas, você declara que leu e concorda
              com estes Termos de Uso e com a Política de Privacidade.
            </p>

            <p>
              Caso não concorde com estas condições, você deverá
              interromper o uso das funcionalidades que dependam
              dessa aceitação.
            </p>
          </section>

          <section className="terms-card">
            <h2>2. Sobre o Vagas Nordestinas</h2>

            <p>
              O Vagas Nordestinas é uma plataforma voltada à busca,
              organização e divulgação de oportunidades profissionais,
              oferecendo recursos para candidatos, recrutadores,
              empresas e suporte.
            </p>

            <p>
              A plataforma poderá disponibilizar busca e filtros de
              vagas, perfis profissionais, currículos, favoritos,
              candidaturas, recomendações, análises de compatibilidade,
              recursos de inteligência artificial, preparação para
              entrevistas e atendimento ao usuário.
            </p>
          </section>

          <section className="terms-card">
            <h2>3. Cadastro e conta</h2>

            <p>
              Algumas funcionalidades poderão exigir a criação de uma
              conta.
            </p>

            <p>
              O usuário deverá fornecer informações corretas e manter
              seus dados atualizados.
            </p>

            <ul>
              <li>
                Não compartilhe senhas, tokens ou credenciais.
              </li>

              <li>
                Não utilize conta pertencente a outra pessoa sem
                autorização.
              </li>

              <li>
                Não forneça informações falsas com objetivo de
                enganar usuários, empresas ou recrutadores.
              </li>

              <li>
                Informe o suporte caso identifique acesso indevido
                à sua conta.
              </li>
            </ul>
          </section>

          <section className="terms-card">
            <h2>4. Perfil profissional e currículo</h2>

            <p>
              O candidato poderá cadastrar informações relacionadas
              à experiência profissional, formação, projetos,
              habilidades, idiomas, localização e preferências
              profissionais.
            </p>

            <p>
              A plataforma poderá permitir o envio de currículos
              em formatos suportados.
            </p>

            <p>
              O usuário é responsável por revisar informações
              extraídas automaticamente do currículo e corrigir
              eventuais erros antes de utilizá-las.
            </p>
          </section>

          <section className="terms-card">
            <h2>5. Vagas e fontes externas</h2>

            <p>
              As vagas poderão ser cadastradas diretamente por
              empresas e recrutadores ou obtidas de fontes públicas
              e previamente aprovadas pela plataforma.
            </p>

            <p>
              Uma vaga originada de serviço externo poderá ser
              alterada, encerrada ou removida pela fonte original
              sem aviso prévio ao Vagas Nordestinas.
            </p>

            <p>
              O usuário poderá reportar vagas duplicadas, incorretas,
              suspeitas ou desatualizadas.
            </p>
          </section>

          <section className="terms-card">
            <h2>6. Candidaturas</h2>

            <p>
              O Vagas Nordestinas poderá auxiliar o usuário na
              preparação de uma candidatura, mas a decisão de se
              candidatar permanece com o candidato.
            </p>

            <p>
              Recursos de IA poderão analisar currículo, vaga,
              habilidades e materiais da candidatura.
            </p>

            <p>
              O Vagas Nordestinas não realiza Smart Apply automático.
              Quando houver geração de carta, análise ou preparação
              de candidatura, o usuário deverá revisar o material e
              realizar normalmente a candidatura.
            </p>

            <p>
              Uma candidatura não representa garantia de entrevista,
              aprovação ou contratação.
            </p>
          </section>

          <section className="terms-card">
            <h2>7. Empresas e recrutadores</h2>

            <p>
              Empresas e recrutadores deverão fornecer informações
              verdadeiras sobre sua organização e suas oportunidades.
            </p>

            <p>
              Não é permitido publicar vagas fraudulentas, enganosas
              ou destinadas à coleta indevida de dados.
            </p>

            <p>
              Dados recebidos de candidatos deverão ser utilizados
              somente para finalidades compatíveis com recrutamento,
              seleção e gestão das respectivas candidaturas.
            </p>

            <p>
              O Vagas Nordestinas poderá moderar, pausar, arquivar ou
              remover vagas e contas que violem estes Termos.
            </p>
          </section>

          <section className="terms-card terms-card-highlight">
            <div className="terms-title-row">
              <span className="terms-icon">
                AI
              </span>

              <h2>
                8. Inteligência Artificial
              </h2>
            </div>

            <p>
              A plataforma poderá utilizar inteligência artificial
              para análise de currículo, identificação de habilidades,
              matching, recomendações, geração de materiais,
              preparação para entrevistas e suporte.
            </p>

            <p>
              Conteúdos produzidos por IA podem conter erros,
              omissões ou interpretações imprecisas e devem ser
              revisados pelo usuário.
            </p>

            <p>
              A IA não deverá inventar experiência profissional,
              cargo, resultado, tecnologia, certificação, idioma ou
              habilidade inexistente.
            </p>
          </section>

          <section className="terms-card">
            <h2>9. Scores, matching e recomendações</h2>

            <p>
              A plataforma poderá calcular indicadores de
              compatibilidade entre currículos, perfis e requisitos
              de vagas.
            </p>

            <p>
              Esses indicadores são estimativas e não representam
              probabilidade real de contratação.
            </p>

            <p>
              Um score alto não garante entrevista ou aprovação,
              assim como um score baixo não significa que o usuário
              não possa se candidatar.
            </p>

            <p>
              Rankings e recomendações não deverão substituir
              automaticamente decisões humanas de contratação.
            </p>
          </section>

          <section className="terms-card">
            <h2>10. Recomendações personalizadas</h2>

            <p>
              A plataforma poderá utilizar informações do perfil,
              currículo, preferências e interações para oferecer
              recomendações mais relevantes.
            </p>

            <p>
              Quando necessário, esse tratamento dependerá de
              consentimento ou de outra base legal aplicável.
            </p>

            <p>
              Consentimentos específicos poderão ser gerenciados
              separadamente do aceite geral destes Termos.
            </p>
          </section>

          <section className="terms-card">
            <h2>11. Interview Trainer</h2>

            <p>
              Futuras funcionalidades poderão permitir treinamento
              de entrevistas por texto ou áudio.
            </p>

            <p>
              O uso de microfone, gravação, áudio ou transcrição
              deverá ser informado ao usuário antes do processamento
              e poderá exigir consentimento específico.
            </p>

            <p>
              Avaliações de inglês, comunicação ou desempenho possuem
              finalidade orientativa e educacional e não equivalem a
              certificação oficial.
            </p>

            <p>
              A plataforma não deverá inferir personalidade, estado
              de saúde, competência geral ou outras características
              inadequadas a partir de voz, aparência ou sotaque.
            </p>
          </section>

          <section className="terms-card">
            <h2>12. Benchmark de entrevistas</h2>

            <p>
              Caso exista comparação entre respostas de entrevistas,
              a participação deverá ser opcional.
            </p>

            <p>
              Rankings e percentis terão finalidade educacional e não
              deverão ser utilizados automaticamente para rejeitar
              candidatos.
            </p>

            <p>
              O usuário poderá ter mecanismos para retirar sua
              participação ou solicitar exclusão das tentativas,
              conforme as funcionalidades disponíveis.
            </p>
          </section>

          <section className="terms-card">
            <h2>13. Suporte e chamados</h2>

            <p>
              O usuário poderá abrir chamados, acompanhar
              atendimentos, enviar mensagens e anexar evidências
              relacionadas ao problema informado.
            </p>

            <p>
              Não envie senhas, tokens, chaves privadas ou outros
              segredos em tickets e chats.
            </p>

            <p>
              Informações enviadas ao suporte poderão ser utilizadas
              para investigar e resolver o problema correspondente.
            </p>
          </section>

          <section className="terms-card">
            <h2>14. Suporte por IA e RAG</h2>

            <p>
              O sistema de suporte poderá utilizar recuperação de
              informações e inteligência artificial para consultar
              documentação aprovada da plataforma.
            </p>

            <p>
              Quando não houver informação suficiente, o sistema
              poderá indicar sua limitação e encaminhar o usuário
              para atendimento humano ou abertura de chamado.
            </p>

            <p>
              O suporte automatizado não deverá inventar procedimentos
              ou acessar informações privadas sem autorização.
            </p>
          </section>

          <section className="terms-card">
            <h2>15. Casos públicos de suporte</h2>

            <p>
              Determinados problemas resolvidos poderão ser
              transformados em casos públicos educativos.
            </p>

            <p>
              A publicação de informações identificáveis deverá
              depender da autorização aplicável e dos campos
              especificamente autorizados pelo usuário.
            </p>

            <p>
              Informações não autorizadas deverão permanecer privadas
              ou ser removidas ou anonimizadas.
            </p>
          </section>

          <section className="terms-card">
            <h2>16. Uso proibido</h2>

            <p>
              Não é permitido utilizar a plataforma para:
            </p>

            <ul>
              <li>
                fraude, golpes ou outras atividades ilegais;
              </li>

              <li>
                criação de empresas ou vagas falsas;
              </li>

              <li>
                acesso indevido a contas ou dados de terceiros;
              </li>

              <li>
                disseminação de malware ou tentativa de exploração
                da infraestrutura;
              </li>

              <li>
                scraping abusivo ou automação que prejudique o
                funcionamento da plataforma;
              </li>

              <li>
                coleta de dados de candidatos para finalidade
                incompatível com recrutamento;
              </li>

              <li>
                envio deliberado de conteúdo fraudulento,
                enganoso ou malicioso.
              </li>
            </ul>
          </section>

          <section className="terms-card">
            <h2>17. Links e serviços externos</h2>

            <p>
              Algumas vagas e funcionalidades poderão direcionar
              usuários a sites de terceiros.
            </p>

            <p>
              Esses serviços possuem seus próprios termos,
              políticas e práticas.
            </p>

            <p>
              O Vagas Nordestinas não controla conteúdos ou
              alterações realizadas por serviços externos.
            </p>
          </section>

          <section className="terms-card">
            <h2>18. Segurança</h2>

            <p>
              A plataforma buscará adotar medidas técnicas e
              organizacionais adequadas para proteger contas,
              currículos, candidaturas, tickets e demais informações.
            </p>

            <p>
              Entretanto, nenhum sistema conectado à internet pode
              garantir segurança absoluta ou funcionamento
              ininterrupto.
            </p>
          </section>

          <section className="terms-card">
            <h2>19. Suspensão e remoção</h2>

            <p>
              Contas, vagas ou conteúdos poderão ser limitados,
              suspensos ou removidos em situações de fraude, abuso,
              risco à segurança ou violação destes Termos.
            </p>
          </section>

          <section className="terms-card">
            <h2>20. Disponibilidade da plataforma</h2>

            <p>
              Funcionalidades poderão ser adicionadas, modificadas,
              suspensas ou removidas conforme a evolução do produto.
            </p>

            <p>
              A plataforma poderá ficar temporariamente indisponível
              devido a manutenção, falhas técnicas, atualizações ou
              fatores externos.
            </p>
          </section>

          <section className="terms-card">
            <h2>21. Propriedade intelectual</h2>

            <p>
              A identidade visual, interface, código, documentação
              e conteúdos próprios do Vagas Nordestinas estão sujeitos
              às regras aplicáveis de propriedade intelectual.
            </p>

            <p>
              Marcas e conteúdos pertencentes a terceiros continuam
              sendo de responsabilidade de seus respectivos
              titulares.
            </p>
          </section>

          <section className="terms-card">
            <h2>22. Privacidade</h2>

            <p>
              O tratamento de dados pessoais utilizados em contas,
              currículos, candidaturas, IA, recomendações,
              entrevistas e suporte é explicado na{" "}
              <Link
                to="/politica-de-privacidade"
                className="terms-text-link"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </section>

          <section className="terms-card">
            <h2>23. Cookies e armazenamento local</h2>

            <p>
              A plataforma poderá utilizar armazenamento local,
              cookies ou tecnologias semelhantes para funções
              necessárias, como autenticação, segurança,
              preferências e registro de aceite.
            </p>

            <p>
              Caso sejam implementadas tecnologias opcionais de
              analytics, publicidade ou rastreamento, poderão ser
              apresentados controles específicos antes de seu uso,
              quando necessário.
            </p>
          </section>

          <section className="terms-card">
            <h2>24. Limitação de responsabilidade</h2>

            <p>
              O Vagas Nordestinas não garante contratação,
              entrevista, aprovação, determinado salário,
              permanência de uma vaga ou resposta de uma empresa.
            </p>

            <p>
              A plataforma oferece ferramentas de apoio. As decisões
              profissionais e de contratação permanecem sob
              responsabilidade dos usuários e organizações
              envolvidas.
            </p>
          </section>

          <section className="terms-card">
            <h2>25. Alterações destes Termos</h2>

            <p>
              Estes Termos poderão ser atualizados para acompanhar
              mudanças na legislação, na plataforma e em suas
              funcionalidades.
            </p>

            <p>
              A data da versão mais recente será informada no início
              desta página.
            </p>
          </section>

          <section className="terms-card">
            <h2>26. Contato</h2>

            <p>
              Dúvidas relacionadas a estes Termos, segurança,
              privacidade ou funcionamento da plataforma poderão ser
              encaminhadas pelos canais oficiais de suporte do
              Vagas Nordestinas.
            </p>
          </section>

          <div className="terms-warning">
            <div className="terms-warning-icon">
              !
            </div>

            <div>
              <strong>
                Leia também a Política de Privacidade
              </strong>

              <p>
                Ela explica com mais detalhes quais dados podem ser
                tratados, para quais finalidades e quais controles
                estarão disponíveis ao usuário.
              </p>
            </div>
          </div>

          <div className="terms-actions">
            <Link
              to="/"
              className="terms-button terms-button-secondary"
            >
              Voltar para as vagas
            </Link>

            <Link
              to="/politica-de-privacidade"
              className="terms-button terms-button-primary"
            >
              Política de Privacidade
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}