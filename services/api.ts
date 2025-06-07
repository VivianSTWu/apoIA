import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "https://apo-ia.azurewebsites.net";

// Credenciais padrão
const DEFAULT_CREDENTIALS = {
  email: "admin@email.com",
  senha: "admin",
};

// Variável para armazenar o token JWT
let token: string | null = null;

// Login e armazenamento do token
export async function login() {
  const response = await fetch('https://apo-ia.azurewebsites.net/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@email.com', senha: 'Ollama@2025!!' }),
  });

  if (!response.ok) {
    throw new Error('Erro ao fazer login');
  }

  const data = await response.json();
  const token = data.token;

  if (!token) throw new Error('Token ausente na resposta de login');

  await AsyncStorage.setItem('token', token);
  console.log('Token armazenado:', token);

  return token; // opcional
}


// Headers com token
function getAuthHeaders(): HeadersInit {
  if (!token) {
    throw new Error("Token não disponível. Realize o login primeiro.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// -------------------- Local-----------------

export async function criarLocal(dados) {
  const token = await AsyncStorage.getItem('token');
  console.log('[criarLocal] Token:', token);
  console.log('[criarLocal] Enviando dados:', dados);

  const response = await fetch('https://apo-ia.azurewebsites.net/local', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  const contentType = response.headers.get('content-type');
  const status = response.status;
  const text = await response.text();

  console.log('[criarLocal] Status:', status);
  console.log('[criarLocal] Content-Type:', contentType);
  console.log('[criarLocal] Resposta:', text.slice(0, 500));

  if (!response.ok) {
    throw new Error(`Erro HTTP ${status}: ${text.slice(0, 100)}`);
  }

  if (contentType?.includes('application/json')) {
    return JSON.parse(text);
  } else {
    throw new Error('Resposta não é JSON.');
  }
}

// -------------------- Abrigados --------------------

export async function listarAbrigados(): Promise<any[]> {
  const response = await fetch(`${BASE_URL}/abrigado`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao listar abrigados");
  return response.json();
}

export async function listarAbrigadoPorId(id: string): Promise<any> {
  const response = await fetch(`${BASE_URL}/abrigado/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao buscar abrigado por ID");
  return response.json();
}

export async function criarAbrigado(abrigado: any): Promise<any> {
  const response = await fetch(`${BASE_URL}/abrigado`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(abrigado),
  });

  if (!response.ok) throw new Error("Erro ao criar abrigado");
  return response.json();
}

export async function atualizarAbrigado(id: string, abrigado: any): Promise<any> {
  const response = await fetch(`${BASE_URL}/abrigado/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(abrigado),
  });

  if (!response.ok) throw new Error("Erro ao atualizar abrigado");
  return response.json();
}

export async function deletarAbrigado(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/abrigado/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao deletar abrigado");
}

// -------------------- Doenças --------------------

export async function listarDoencas(): Promise<any[]> {
  const response = await fetch(`${BASE_URL}/doenca`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao listar doenças");
  return response.json();
}

export async function criarDoenca(doenca: any): Promise<any> {
  const response = await fetch(`${BASE_URL}/doenca`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(doenca),
  });

  if (!response.ok) throw new Error("Erro ao criar doença");
  return response.json();
}

export async function atualizarDoenca(id: string, doenca: any): Promise<any> {
  const response = await fetch(`${BASE_URL}/doenca/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(doenca),
  });

  if (!response.ok) throw new Error("Erro ao atualizar doença");
  return response.json();
}

export async function deletarDoenca(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/doenca/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao deletar doença");
}

// -------------------- Habilidades --------------------

export async function listarHabilidades(): Promise<any[]> {
  const response = await fetch(`${BASE_URL}/habilidade`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao listar habilidades");
  return response.json();
}

export async function criarHabilidade(habilidade: any): Promise<any> {
  const response = await fetch(`${BASE_URL}/habilidade`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(habilidade),
  });

  if (!response.ok) throw new Error("Erro ao criar habilidade");
  return response.json();
}

export async function atualizarHabilidade(id: string, habilidade: any): Promise<any> {
  const response = await fetch(`${BASE_URL}/habilidade/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(habilidade),
  });

  if (!response.ok) throw new Error("Erro ao atualizar habilidade");
  return response.json();
}

export async function deletarHabilidade(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/habilidade/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao deletar habilidade");
}

// Listar habilidades de voluntariado de um abrigado
export async function listarVoluntarioPorAbrigadoId(abrigadoId: string): Promise<any | null> {
  const url = `${BASE_URL}/voluntario`;
  console.log("Buscando voluntários em:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro buscar voluntários:", response.status, errorText);
    throw new Error("Erro ao listar voluntariado");
  }

  const todos = await response.json();

  const encontrado = todos.find((v: any) => v.abrigadoId === abrigadoId);

  if (!encontrado) {
    console.log("Nenhum voluntário encontrado para o abrigado:", abrigadoId);
    return null;
  }

  return encontrado;
}



// Listar condições médicas (doenças) de um abrigado
export async function listarCondicoesPorAbrigadoId(abrigadoId: string): Promise<any[]> {
  const url = `${BASE_URL}/doenca`;
  console.log("Buscando condições médicas em:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro buscar condições médicas:", response.status, errorText);
    throw new Error("Erro ao listar condições médicas");
  }

  const todas = await response.json();

  const associadas = todas.filter((d: any) => d.abrigadoId === abrigadoId);

  console.log(`Condições encontradas para o abrigado ${abrigadoId}:`, associadas);

  return associadas;
}

export async function listarTodasDoencas(): Promise<any[]> {
  const response = await fetch(`${BASE_URL}/doenca`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erro ao listar doenças");
  }

  return response.json();
}




