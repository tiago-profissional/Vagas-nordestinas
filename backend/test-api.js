/**
 * Script de Teste Automatizado para o Back-end Node.js
 * Executar com: node test-api.js
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
};

function logSuccess(title, details = '') {
  console.log(`${colors.green}✔ ${title}${colors.reset}`, details);
}

function logError(title, err) {
  console.log(`${colors.red}✖ ${title}${colors.reset}`, err);
}

function logStep(step) {
  console.log(`\n${colors.cyan}${colors.bold}▶ ${step}${colors.reset}`);
}

async function runTests() {
  console.log(`${colors.bold}========================================${colors.reset}`);
  console.log(`${colors.bold}  TESTANDO API - VAGAS NORDESTINAS (NODE.JS) ${colors.reset}`);
  console.log(`${colors.bold}========================================${colors.reset}\n`);

  let token = null;
  const testEmail = `teste_${Date.now()}@exemplo.com`;
  const testPassword = 'SenhaSegura123!';

  // 1. Health Check
  try {
    logStep('1. Testando Health Check do Servidor');
    const res = await fetch('http://localhost:3000/health');
    const data = await res.json();
    if (res.ok && data.status === 'online') {
      logSuccess('Servidor Express está online e respondendo na porta 3000');
    } else {
      throw new Error(JSON.stringify(data));
    }
  } catch (err) {
    logError('Falha ao conectar no servidor. Ele está rodando com "npm run api"?', err.message);
    process.exit(1);
  }

  // 2. Registro de Usuário
  try {
    logStep('2. Criando novo usuário de teste (/api/auth/register)');
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Tiago Ramon Teste',
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword
      })
    });
    const data = await res.json();

    if (res.status === 201 && data.access_token) {
      token = data.access_token;
      logSuccess('Usuário cadastrado com sucesso e JWT obtido!');
    } else {
      throw new Error(data.error || data.message || JSON.stringify(data));
    }
  } catch (err) {
    logError('Erro no cadastro do usuário (Verifique se o MySQL está rodando):', err.message);
    process.exit(1);
  }

  // 3. Login de Usuário
  try {
    logStep('3. Testando Login e Validação de Credenciais (/api/auth/login)');
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const data = await res.json();

    if (res.status === 200 && data.access_token) {
      token = data.access_token;
      logSuccess('Login autenticado com sucesso e novo JWT gerado!');
    } else {
      throw new Error(data.error || JSON.stringify(data));
    }
  } catch (err) {
    logError('Erro no login:', err.message);
  }

  // 4. Buscar Perfil do Usuário
  try {
    logStep('4. Consultando perfil com JWT (/api/users/profile)');
    const res = await fetch(`${BASE_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (res.status === 200 && data.data) {
      logSuccess('Perfil obtido com sucesso!');
      console.log(`   Percentual inicial de conclusão: ${colors.yellow}${data.data.meta.profile_completion_percentage}%${colors.reset}`);
    } else {
      throw new Error(data.error || JSON.stringify(data));
    }
  } catch (err) {
    logError('Erro ao buscar perfil:', err.message);
  }

  // 5. Atualizar Perfil (Simulando a tela do usuário)
  try {
    logStep('5. Atualizando dados do perfil (/api/users/profile)');
    const updatePayload = {
      personal_data: {
        name: 'Tiago Ramon',
        email: testEmail,
        phone: '(88) 99999-9999',
        city: 'Aracati',
        state: 'Ceará',
        birth_date: '15/04/2004'
      },
      professional_preferences: {
        desired_role: 'Desenvolvedor Web Júnior',
        work_model: 'Remoto',
        contract_type: 'CLT ou PJ',
        availability: 'Imediata',
        skills: ['React', 'TypeScript', 'Node.js', 'PHP']
      },
      account_privacy: {
        allow_recruiters: true,
        email_recommendations: true
      }
    };

    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatePayload)
    });
    const data = await res.json();

    if (res.status === 200 && data.data) {
      logSuccess('Perfil atualizado com sucesso!');
      console.log(`   Nome: ${data.data.personal_data.name}`);
      console.log(`   Cidade/Estado: ${data.data.personal_data.city}, ${data.data.personal_data.state}`);
      console.log(`   Cargo Desejado: ${data.data.professional_preferences.desired_role}`);
      console.log(`   Habilidades: ${JSON.stringify(data.data.professional_preferences.skills)}`);
      console.log(`   ${colors.green}${colors.bold}Percentual recalculado: ${data.data.meta.profile_completion_percentage}% completo!${colors.reset}`);
    } else {
      throw new Error(data.message || JSON.stringify(data));
    }
  } catch (err) {
    logError('Erro ao atualizar perfil:', err.message);
  }

  // 6. Teste de Validação de Erro (E-mail inválido / enum inválido)
  try {
    logStep('6. Testando validação de erro 400 Bad Request');
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        personal_data: { email: 'email_invalido_sem_arroba' },
        professional_preferences: { work_model: 'Espacial' }
      })
    });
    const data = await res.json();

    if (res.status === 400 && data.errors) {
      logSuccess('Validador rejeitou dados inválidos com status 400 corretamente!');
      console.log('   Erros capturados:', data.errors);
    } else {
      throw new Error('A validação deveria ter falhado!');
    }
  } catch (err) {
    logError('Erro no teste de validação:', err.message);
  }

  // 7. Teste de Soft Delete da Conta
  try {
    logStep('7. Testando exclusão lógica da conta (/api/users/account)');
    const res = await fetch(`${BASE_URL}/users/account`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (res.status === 200 && data.success) {
      logSuccess('Soft delete executado com sucesso (deleted_at preenchido)');
    } else {
      throw new Error(data.error || JSON.stringify(data));
    }
  } catch (err) {
    logError('Erro na exclusão de conta:', err.message);
  }

  console.log(`\n${colors.bold}${colors.green}========================================${colors.reset}`);
  console.log(`${colors.bold}${colors.green}  TODOS OS TESTES FORAM CONCLUÍDOS! 🎉   ${colors.reset}`);
  console.log(`${colors.bold}${colors.green}========================================${colors.reset}\n`);
}

runTests();

