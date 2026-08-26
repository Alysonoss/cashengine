import { teamMembers } from "@/lib/mock/data";

export type DemoTeamStatus = "ativo" | "convite_pendente" | "inativo";

export type DemoTeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: DemoTeamStatus;
  lastAccess: string | null;
  createdAt: string;
  updatedAt: string;
  inviteSentAt: string | null;
};

export const TEAM_ROLE_OPTIONS = [
  "Owner / Fundador",
  "Administrador",
  "Gerente Financeiro",
  "Gerente de Vendas",
  "Gerente de Afiliados",
  "Atendente / Suporte",
  "Vendedor",
  "Marketing / Conteúdo",
  "Analista Financeiro",
  "Visualizador",
] as const;

const STORAGE_KEY = "cash-engine-test-team-v1";

const seedRoleMap: Record<string, string> = {
  Proprietário: "Owner / Fundador",
  Financeiro: "Gerente Financeiro",
  Atendimento: "Atendente / Suporte",
  Marketing: "Marketing / Conteúdo",
  Desenvolvedor: "Gerente de Vendas",
  Leitura: "Visualizador",
};

function seedMembers(): DemoTeamMember[] {
  return teamMembers.map((member) => ({
    ...member,
    role: seedRoleMap[member.role] ?? member.role,
    updatedAt: member.createdAt,
    inviteSentAt: member.status === "convite_pendente" ? member.createdAt : null,
  }));
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readDemoTeam(): DemoTeamMember[] {
  if (!canUseStorage()) return seedMembers();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = seedMembers();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    const parsed = JSON.parse(raw) as DemoTeamMember[];
    if (!Array.isArray(parsed)) throw new Error("invalid team storage");
    return parsed;
  } catch {
    const seed = seedMembers();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

function writeDemoTeam(members: DemoTeamMember[]) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }
  return members;
}

export function inviteDemoTeamMember(input: { name: string; email: string; role: string }) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const role = input.role.trim();

  if (name.length < 2) throw new Error("Informe o nome do membro.");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Informe um e-mail válido.");
  if (!TEAM_ROLE_OPTIONS.includes(role as (typeof TEAM_ROLE_OPTIONS)[number])) {
    throw new Error("Selecione uma função válida.");
  }
  if (role === "Owner / Fundador") {
    throw new Error("O papel de Owner não pode ser concedido por convite.");
  }

  const members = readDemoTeam();
  if (members.some((member) => member.email.toLowerCase() === email)) {
    throw new Error("Já existe um membro ou convite com esse e-mail.");
  }

  const now = new Date().toISOString();
  const member: DemoTeamMember = {
    id: `TE-${Date.now().toString(36).toUpperCase()}`,
    name,
    email,
    role,
    status: "convite_pendente",
    lastAccess: null,
    createdAt: now,
    updatedAt: now,
    inviteSentAt: now,
  };

  writeDemoTeam([member, ...members]);
  return member;
}

export function updateDemoTeamRole(id: string, role: string) {
  if (!TEAM_ROLE_OPTIONS.includes(role as (typeof TEAM_ROLE_OPTIONS)[number])) {
    throw new Error("Selecione uma função válida.");
  }

  const members = readDemoTeam();
  const target = members.find((member) => member.id === id);
  if (!target) throw new Error("Membro não encontrado.");
  if (target.role === "Owner / Fundador") {
    throw new Error("A função do Owner não pode ser alterada nesta tela.");
  }
  if (role === "Owner / Fundador") {
    throw new Error("O papel de Owner não pode ser transferido nesta tela.");
  }

  return writeDemoTeam(
    members.map((member) =>
      member.id === id ? { ...member, role, updatedAt: new Date().toISOString() } : member,
    ),
  );
}

export function setDemoTeamMemberStatus(
  id: string,
  status: Exclude<DemoTeamStatus, "convite_pendente">,
) {
  const members = readDemoTeam();
  const target = members.find((member) => member.id === id);
  if (!target) throw new Error("Membro não encontrado.");
  if (target.role === "Owner / Fundador") {
    throw new Error("O Owner não pode ser desativado.");
  }
  if (target.status === "convite_pendente") {
    throw new Error("Um convite pendente ainda não é um membro ativo.");
  }

  return writeDemoTeam(
    members.map((member) =>
      member.id === id ? { ...member, status, updatedAt: new Date().toISOString() } : member,
    ),
  );
}

export function resendDemoTeamInvite(id: string) {
  const members = readDemoTeam();
  const target = members.find((member) => member.id === id);
  if (!target) throw new Error("Convite não encontrado.");
  if (target.status !== "convite_pendente")
    throw new Error("Este membro não possui convite pendente.");

  const now = new Date().toISOString();
  return writeDemoTeam(
    members.map((member) =>
      member.id === id ? { ...member, inviteSentAt: now, updatedAt: now } : member,
    ),
  );
}

export function removeDemoTeamMember(id: string) {
  const members = readDemoTeam();
  const target = members.find((member) => member.id === id);
  if (!target) throw new Error("Membro não encontrado.");
  if (target.role === "Owner / Fundador") throw new Error("O Owner não pode ser removido.");

  return writeDemoTeam(members.filter((member) => member.id !== id));
}
