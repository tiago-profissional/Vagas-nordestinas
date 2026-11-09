import { Link } from "react-router-dom";

import Headers from "./Headers.jsx";
import Footer from "./Footer";

import "../styles/TermsUseScreen.css";

// IMPORTANTE:
// Troque pelo e-mail real antes de publicar o site.
const PRIVACY_EMAIL = "privacidade@SEU-DOMINIO.com";

export default function PrivacyPolicyScreen() {
  return (
    <div className="terms-page">
      <Headers />

      <main>
        <section className="terms-hero">
          <div className="terms-hero-content">
            <span className="terms-badge">
              Vagas Nordestinas
            </span>

            <h1>Política de Privacidade</h1>

            <p>
              Saiba como os dados pessoais podem ser utilizados,
              protegidos e gerenciados no Vagas Nordestinas.
            </p>
          </div>
        </section>

        <div className="terms-container">
          <div className="terms-update">
            <strong>Última atualização:</strong>{" "}
            22 de setembro de 2026.
          </div>

          <section className="terms-card">
            <h2>1. Objetivo desta Política</h2>

            <p>
              Esta Política explica como o Vagas Nordestinas poderá
              coletar, utilizar, armazenar, proteger, compartilhar e
              excluir dados pessoais relacionados às funcionalidades
              da plataforma.
            </p>

            <p>
              Ela deve ser lida junto aos{" "}
              <Link
                to="/termos-de-uso"
                className="terms-text-link"
              >
                Termos de Uso
              </Link>
              .
            </p>
          </section>

          <section className="terms-card">
            <h2>2. Responsável pelo tratamento</h2>

            <p>
              O responsável pelo Vagas Nordestinas deverá identificar
              corretamente o controlador dos dados antes do lançamento
              público da plataforma.
            </p>

            <p>
              Canal de contato para assuntos de privacidade:
            </p>

            <p>
              <strong>{PRIVACY_EMAIL}</strong>
            </p>

            <p>
              Substitua esse endereço pelo e-mail oficial antes de
              publicar o site.
            </p>
          </section>

          <section className="terms-card">
            <h2>3. Dados que poderão ser tratados</h2>

            <p>
              Dependendo das funcionalidades utilizadas, poderemos
              tratar categorias como:
            </p>

            <ul>
              <li>
                nome, e-mail e informações de autenticação;
              </li>

              <li>
                foto, localização e preferências profissionais;
              </li>

              <li>
                experiências profissionais, formação, projetos,
                idiomas e habilidades;
              </li>

              <li>
                currículos e informações extraídas de arquivos;
              </li>

              <li>
                vagas salvas e histórico de interação;
              </li>

              <li>
                candidaturas e respectivos status;
              </li>

              <li>
                informações de empresas e recrutadores;
              </li>

              <li>
                tickets, mensagens e anexos de suporte;
              </li>

              <li>
                dados técnicos de segurança e funcionamento;
              </li>

              <li>
                consultas, entradas e saídas relacionadas a
                funcionalidades de IA;
              </li>

              <li>
                áudio e transcrição, quando o Interview Trainer
                for utilizado;
              </li>

              <li>
                dados de benchmark, quando o usuário optar por
                participar.
              </li>
            </ul>
          </section>

          <section className="terms-card">
            <h2>4. Finalidades do tratamento</h2>

            <p>
              Os dados poderão ser utilizados para:
            </p>

            <ul>
              <li>
                criar e proteger contas;
              </li>

              <li>
                disponibilizar perfis profissionais;
              </li>

              <li>
                armazenar e analisar currículos;
              </li>

              <li>
                permitir busca, favoritos e candidaturas;
              </li>

              <li>
                gerar recomendações de vagas;
              </li>

              <li>
                calcular matching e indicadores de compatibilidade;
              </li>

              <li>
                gerar sugestões e materiais por IA;
              </li>

              <li>
                permitir treinamento de entrevistas;
              </li>

              <li>
                operar suporte e resolução de chamados;
              </li>

              <li>
                prevenir fraude e proteger a plataforma;
              </li>

              <li>
                diagnosticar erros e melhorar funcionalidades;
              </li>

              <li>
                cumprir obrigações legais quando aplicável.
              </li>
            </ul>
          </section>

          <section className="terms-card">
            <h2>5. Bases e justificativas para tratamento</h2>

            <p>
              Dependendo da funcionalidade e da legislação
              aplicável, o tratamento poderá ocorrer para execução
              dos serviços solicitados pelo usuário, cumprimento de
              obrigações legais, proteção da plataforma, exercício
              de direitos ou mediante consentimento.
            </p>

            <p>
              Quando uma funcionalidade depender especificamente
              de consentimento, o usuário deverá receber informação
              adequada e poderá ter mecanismo para revogá-lo.
            </p>
          </section>

          <section className="terms-card terms-card-highlight">
            <div className="terms-title-row">
              <span className="terms-icon">
                AI
              </span>

              <h2>
                6. Inteligência Artificial
              </h2>
            </div>

            <p>
              Informações fornecidas pelo usuário poderão ser
              processadas por sistemas de inteligência artificial
              quando isso for necessário para entregar a
              funcionalidade solicitada.
            </p>

            <p>
              Exemplos incluem análise de currículo, matching,
              recomendações, geração de cartas, preparação para
              entrevistas e suporte.
            </p>

            <p>
              A plataforma deverá buscar reduzir o envio de dados
              pessoais desnecessários a modelos ou provedores
              externos.
            </p>

            <p>
              Resultados gerados por IA devem ser tratados como
              auxílio e podem conter erros.
            </p>
          </section>

          <section className="terms-card">
            <h2>7. Análise de currículo</h2>

            <p>
              Currículos poderão ser processados para extrair
              informações como experiências, habilidades, projetos,
              formação e idiomas.
            </p>

            <p>
              O resultado deverá permanecer revisável pelo usuário.
            </p>

            <p>
              A IA não deverá adicionar experiências ou habilidades
              inexistentes como se fossem fatos.
            </p>

            <p>
              O usuário poderá corrigir as informações extraídas
              antes de utilizá-las em outras funcionalidades.
            </p>
          </section>

          <section className="terms-card">
            <h2>8. Matching e decisões automatizadas</h2>

            <p>
              O Vagas Nordestinas poderá utilizar algoritmos para
              comparar currículos, perfis e vagas.
            </p>

            <p>
              Scores e recomendações são estimativas e não devem
              representar automaticamente uma decisão de contratação.
            </p>

            <p>
              O usuário poderá receber explicações sobre fatores
              relevantes do matching quando essa funcionalidade
              estiver disponível.
            </p>

            <p>
              Sistemas automatizados não deverão substituir
              indevidamente decisões humanas relevantes.
            </p>
          </section>

          <section className="terms-card">
            <h2>9. Recomendações personalizadas</h2>

            <p>
              Preferências, perfil, currículo e interações poderão
              ser utilizados para recomendar oportunidades mais
              relevantes.
            </p>

            <p>
              Quando o uso desses dados depender de consentimento,
              será apresentado um controle separado.
            </p>

            <p>
              O usuário poderá ter a opção de desativar recomendações
              personalizadas ou revogar o consentimento correspondente.
            </p>
          </section>

          <section className="terms-card">
            <h2>10. Interview Trainer</h2>

            <p>
              Caso o usuário utilize treinamento de entrevista por
              áudio, o sistema poderá processar gravação ou
              transcrição para fornecer feedback.
            </p>

            <p>
              O uso de áudio deverá ser informado de maneira clara e
              poderá depender de consentimento específico.
            </p>

            <p>
              O usuário deverá poder conhecer a finalidade do
              processamento antes de iniciar a gravação.
            </p>

            <p>
              Áudio, transcrição e histórico poderão estar sujeitos
              a mecanismos de exclusão e retenção.
            </p>
          </section>

          <section className="terms-card">
            <h2>11. Benchmark de entrevistas</h2>

            <p>
              Caso exista comparação entre tentativas de entrevistas,
              a participação deverá ser opcional.
            </p>

            <p>
              Informações utilizadas para comparação deverão buscar
              impedir exposição desnecessária de identidade.
            </p>

            <p>
              O usuário deverá poder sair do benchmark e solicitar
              exclusão de suas tentativas quando aplicável.
            </p>

            <p>
              O ranking não deverá ser enviado automaticamente a
              recrutadores nem utilizado sozinho para rejeitar um
              candidato.
            </p>
          </section>

          <section className="terms-card">
            <h2>12. Suporte, tickets e RAG</h2>

            <p>
              Dados enviados ao suporte poderão ser utilizados para
              investigar problemas, manter histórico do atendimento
              e responder solicitações.
            </p>

            <p>
              O suporte por RAG poderá consultar documentação
              previamente publicada e autorizada.
            </p>

            <p>
              O MVP de suporte automatizado não deverá acessar
              currículo, candidatura, conta ou ticket privado sem
              autorização apropriada.
            </p>

            <p>
              Quando a base não possuir informação suficiente,
              o sistema deverá encaminhar o usuário para suporte
              humano ou abertura de chamado.
            </p>
          </section>

          <section className="terms-card">
            <h2>13. Casos públicos de suporte</h2>

            <p>
              Um caso de suporte somente deverá exibir informações
              pessoais identificáveis quando existir autorização
              aplicável para a publicação.
            </p>

            <p>
              A interface poderá permitir ao usuário escolher quais
              campos poderão aparecer publicamente.
            </p>

            <p>
              Dados não autorizados deverão permanecer privados,
              ser removidos ou anonimizados.
            </p>
          </section>

          <section className="terms-card">
            <h2>14. Cookies e armazenamento local</h2>

            <p>
              A plataforma poderá utilizar armazenamento local,
              cookies e tecnologias semelhantes necessárias para
              autenticação, segurança, funcionamento e preferências.
            </p>

            <p>
              O aceite dos documentos legais também poderá ser
              armazenado localmente para evitar que o aviso seja
              exibido repetidamente.
            </p>

            <p>
              Caso sejam adicionadas tecnologias opcionais de
              analytics, publicidade ou rastreamento, poderão ser
              oferecidas opções específicas de consentimento e
              gerenciamento.
            </p>
          </section>

          <section className="terms-card">
            <h2>15. Compartilhamento de dados</h2>

            <p>
              Alguns dados poderão ser processados por fornecedores
              de infraestrutura, armazenamento, autenticação,
              observabilidade, comunicação ou inteligência
              artificial necessários ao funcionamento do serviço.
            </p>

            <p>
              O acesso deverá ser limitado às finalidades
              correspondentes e aos dados necessários.
            </p>

            <p>
              Também poderá ocorrer compartilhamento quando exigido
              por lei ou autoridade competente.
            </p>
          </section>

          <section className="terms-card">
            <h2>16. Serviços e vagas de terceiros</h2>

            <p>
              Ao acessar uma vaga ou serviço externo, o usuário poderá
              ser direcionado para uma plataforma que possui sua
              própria política de privacidade.
            </p>

            <p>
              O tratamento realizado diretamente por terceiros não
              é controlado pelo Vagas Nordestinas.
            </p>
          </section>

          <section className="terms-card">
            <h2>17. Transferências e infraestrutura</h2>

            <p>
              Dependendo dos serviços de cloud e fornecedores
              utilizados, dados poderão ser processados em
              infraestrutura localizada em outras regiões ou países.
            </p>

            <p>
              Quando isso ocorrer, deverão ser observadas medidas
              adequadas de proteção e os requisitos legais
              aplicáveis.
            </p>
          </section>

          <section className="terms-card">
            <h2>18. Retenção dos dados</h2>

            <p>
              Os dados deverão ser mantidos pelo período necessário
              às finalidades para as quais foram coletados ou para
              cumprimento de obrigações aplicáveis.
            </p>

            <p>
              Currículos, áudios, históricos, anexos e outros dados
              poderão possuir regras específicas de retenção.
            </p>

            <p>
              Após o término da finalidade, os dados poderão ser
              excluídos, anonimizados ou mantidos quando existir
              justificativa legal adequada.
            </p>
          </section>

          <section className="terms-card">
            <h2>19. Segurança</h2>

            <p>
              O Vagas Nordestinas buscará adotar medidas técnicas e
              organizacionais compatíveis com os riscos do
              tratamento.
            </p>

            <p>
              Entre as medidas planejadas estão controle de acesso,
              proteção de arquivos privados, auditoria, limitação de
              permissões, proteção de endpoints, backups e redução de
              dados pessoais em logs.
            </p>

            <p>
              Nenhum sistema conectado à internet é totalmente
              imune a incidentes.
            </p>
          </section>

          <section className="terms-card">
            <h2>20. Logs e monitoramento</h2>

            <p>
              Informações técnicas poderão ser registradas para
              segurança, diagnóstico, auditoria e melhoria de
              desempenho.
            </p>

            <p>
              Senhas, tokens, currículos completos e outros dados
              pessoais sensíveis ao contexto não deverão ser
              registrados em logs quando desnecessários.
            </p>
          </section>

          <section className="terms-card">
            <h2>21. Direitos do usuário</h2>

            <p>
              Conforme a legislação aplicável, o usuário poderá
              possuir direitos relacionados aos seus dados pessoais,
              incluindo solicitar informações, acesso, correção,
              exclusão ou outras providências cabíveis.
            </p>

            <p>
              Também poderá solicitar informações relacionadas a
              consentimentos e, quando aplicável, revogá-los.
            </p>

            <p>
              Solicitações poderão ser encaminhadas pelo canal:
            </p>

            <p>
              <strong>{PRIVACY_EMAIL}</strong>
            </p>
          </section>

          <section className="terms-card">
            <h2>22. Exclusão da conta e dos dados</h2>

            <p>
              Quando as funcionalidades correspondentes estiverem
              disponíveis, o usuário poderá solicitar exclusão da
              conta e de dados associados.
            </p>

            <p>
              Poderão existir controles específicos para exclusão
              de currículo, áudio, histórico de entrevistas,
              recomendações e outros registros.
            </p>

            <p>
              Alguns dados poderão precisar ser mantidos por período
              adicional quando necessário para segurança,
              cumprimento legal ou exercício de direitos.
            </p>
          </section>

          <section className="terms-card">
            <h2>23. Revogação de consentimentos</h2>

            <p>
              Consentimentos específicos, como recomendações,
              benchmark ou processamento opcional de determinados
              dados, poderão possuir controles próprios.
            </p>

            <p>
              A revogação não invalida necessariamente tratamentos
              realizados anteriormente de forma legítima.
            </p>
          </section>

          <section className="terms-card">
            <h2>24. Crianças e adolescentes</h2>

            <p>
              A plataforma não foi planejada especificamente para
              coleta indiscriminada de dados de crianças.
            </p>

            <p>
              Caso funcionalidades sejam disponibilizadas a menores
              de idade, deverão ser adotadas medidas compatíveis com
              a legislação aplicável e com a proteção adequada desses
              usuários.
            </p>
          </section>

          <section className="terms-card">
            <h2>25. Alterações desta Política</h2>

            <p>
              Esta Política poderá ser atualizada quando houver
              mudanças relevantes nas funcionalidades, fornecedores,
              práticas de tratamento ou legislação aplicável.
            </p>

            <p>
              A versão mais recente será indicada pela data exibida
              no início desta página.
            </p>
          </section>

          <section className="terms-card">
            <h2>26. Contato sobre privacidade</h2>

            <p>
              Para dúvidas, solicitações ou questões relacionadas
              ao tratamento de dados pessoais, utilize:
            </p>

            <p>
              <strong>{PRIVACY_EMAIL}</strong>
            </p>

            <p>
              Antes de publicar o site, substitua esse endereço pelo
              contato oficial realmente monitorado.
            </p>
          </section>

          <div className="terms-warning">
            <div className="terms-warning-icon">
              !
            </div>

            <div>
              <strong>
                Consentimentos específicos
              </strong>

              <p>
                O aceite desta Política não substitui consentimentos
                específicos que determinadas funcionalidades possam
                exigir, como recomendações personalizadas, áudio de
                entrevista, benchmark ou publicação de casos.
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
              to="/termos-de-uso"
              className="terms-button terms-button-primary"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}