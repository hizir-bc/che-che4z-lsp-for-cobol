import { Event } from "vscode";
import { ExternalConfigurationResponse } from "../lspconfig/_doc/Configuration";

type Filename = string;
type Fingerprint = string;
type MemberName = string;
type Content = string;

export const enum ProcessorConfigurationType {
  HLASM = "HLASM",
  COBOL = "COBOL",
}

interface EndevorType {
  use_map: string;
  environment: string;
  stage: string;
  system: string;
  subsystem: string;
  type: string;
  normalizedPath: () => string;
  toDisplayString: () => string;
  serverId?: () => string | undefined;
}
interface EndevorElement {
  use_map: string;
  environment: string;
  stage: string;
  system: string;
  subsystem: string;
  type: string;
  element: string;
  fingerprint: string;
  normalizedPath: () => string;
  toDisplayString: () => string;
  serverId?: () => string | undefined;
}
interface EndevorMember {
  dataset: string;
  member: string;
  normalizedPath: () => string;
  toDisplayString: () => string;
  serverId?: () => string | undefined;
}
type TypeOrArray<T> = T | T[];
function asArray<T>(o: TypeOrArray<T>) {
  if (Array.isArray(o)) return o;
  return [o];
}
type E4EExternalConfigurationResponse = {
  pgms: ReadonlyArray<{
    program: string;
    pgroup: string;
    options?: {
      [key: string]: string;
    };
  }>;
  pgroups: ReadonlyArray<{
    name: string;
    libs: (
      | {
          dataset: string;
          optional?: boolean;
          profile?: string;
        }
      | {
          environment: string;
          stage: string;
          system: string;
          subsystem: string;
          type: string;
          use_map?: boolean;
          optional?: boolean;
          profile?: string;
        }
    )[];
    options?: {
      [key: string]: string;
    };
    preprocessor?: TypeOrArray<{
      name: string;
      options?: {
        [key: string]: string;
      };
    }>;
  }>;
};

type Filename = string;
type Fingerprint = string;
type MemberName = string;
type Content = string;

export type ResolvedProfile = {
  profile: string;
  instance: string;
};
export type ExternalConfigurationOptions = {
  compiler: string;
  preprocessor: string[];
  type: string;
};
externalConfigs = {
  compiler: "IGYCRCTL",
  preprocessor: ["DSNHPC", "DFHECP1$"],
  type: ProcessorConfigurationType.COBOL,
};

export const defaultConfigs: ExternalConfigurationOptions = {
  ...externalConfigs,
};

export interface IEndevorApiClient {
  isEndevorElement: (uri: string) => boolean;
  // TODO: this function should be replaced with vscode.auth.getSession() call when the Endevor Auth provider is introduced
  getProfileInfo: (
    uriStringOrPartialProfile: Partial<ResolvedProfile> | string,
  ) => Promise<ResolvedProfile | Error>;
  listElements: (
    profile: ResolvedProfile,
    type: {
      use_map: boolean;
      environment: string;
      stage: string;
      system: string;
      subsystem: string;
      type: string;
    },
  ) => Promise<[Filename, Fingerprint][] | Error>;
  getElement: (
    profile: ResolvedProfile,
    type: {
      use_map: boolean;
      environment: string;
      stage: string;
      system: string;
      subsystem: string;
      type: string;
      element: string;
      fingerprint: string;
    },
  ) => Promise<[Content, Fingerprint] | Error>;
  listMembers: (
    profile: ResolvedProfile,
    type: {
      dataset: string;
    },
  ) => Promise<MemberName[] | Error>;
  getMember: (
    profile: ResolvedProfile,
    type: {
      dataset: string;
      member: string;
    },
  ) => Promise<Content | Error>;
  getConfiguration: (
    uriString: string,
    options: ExternalConfigurationOptions,
  ) => Promise<ExternalConfigurationResponse | Error>;
  onDidChangeElement: Event<EndevorElement[]>;
}

const nameof = <T>(name: keyof T) => name;

function validateE4E(e4e: any): e4e is IEndevorApiClient {
  const valid =
    e4e instanceof Object &&
    nameof<IEndevorApiClient>("listElements") in e4e &&
    nameof<IEndevorApiClient>("getElement") in e4e &&
    nameof<IEndevorApiClient>("listMembers") in e4e &&
    nameof<IEndevorApiClient>("getMember") in e4e &&
    nameof<IEndevorApiClient>("isEndevorElement") in e4e &&
    nameof<IEndevorApiClient>("getProfileInfo") in e4e &&
    nameof<IEndevorApiClient>("getConfiguration") in e4e &&
    nameof<IEndevorApiClient>("onDidChangeElement") in e4e;
  if (!valid) throw Error("incompatible interface");
  return valid;
}

function parseEndevorType(server: ResolvedProfile, args: string /*6*/[]) {
  const [use_map, environment, stage, system, subsystem, type] = args;
  const path = `/${encodeURIComponent(use_map)}/${encodeURIComponent(
    environment,
  )}/${encodeURIComponent(stage)}/${encodeURIComponent(
    system,
  )}/${encodeURIComponent(subsystem)}/${encodeURIComponent(type)}`;
  return {
    details: {
      use_map,
      environment,
      stage,
      system,
      subsystem,
      type,
      normalizedPath: () => path,
      toDisplayString: () =>
        `${use_map}/${environment}/${stage}/${system}/${subsystem}/${type}`,
    },
    server,
  };
}

function parserEndevorElement(
  server: ResolvedProfile,
  args: string /*7*/[],
  query: string | undefined,
) {
  const [use_map, environment, stage, system, subsystem, type, element_cbl] =
    args;

  const [element] = element_cbl.split(".");
  if (element.length === 0) return null;
  const fingerprint = query?.match(/^([a-zA-Z0-9]+)$/)?.[1];
  const q = fingerprint ? "?" + query : "";
  const path = `/${encodeURIComponent(use_map)}/${encodeURIComponent(
    environment,
  )}/${encodeURIComponent(stage)}/${encodeURIComponent(
    system,
  )}/${encodeURIComponent(subsystem)}/${encodeURIComponent(
    type,
  )}/${encodeURIComponent(element)}.hlasm${q}`;
  return {
    details: {
      use_map,
      environment,
      stage,
      system,
      subsystem,
      type,
      element,
      fingerprint,
      normalizedPath: () => path,
      toDisplayString: () =>
        `${use_map}/${environment}/${stage}/${system}/${subsystem}/${type}/${element}`,
      serverId: () => server.instance,
    },
    server,
  };
}

function parseDataset(server: ResolvedProfile, args: string /*1*/[]) {
  const [dataset] = args;
  return {
    details: {
      dataset,
      normalizedPath: () => `/${encodeURIComponent(dataset)}`,
      toDisplayString: () => `${dataset}`,
    },
    server,
  };
}

function parseMember(server: ResolvedProfile, args: string /*2*/[]) {
  const [dataset, memeber_hlasm] = args;
  const [member] = memeber_hlasm.split(".");
  if (member.length === 0) return null;
  return {
    details: {
      dataset,
      member,
      normalizedPath: () =>
        `/${encodeURIComponent(dataset)}/${encodeURIComponent(member)}.hlasm`,
      toDisplayString: () => `${dataset}(${member})`,
      serverId: () => server.instance,
    },
    server,
  };
}
function listEndevorElements(
  e4e: E4E,
  type_spec: EndevorType,
  profile: ResolvedProfile,
) {
  return e4e
    .listElements(profile, {
      use_map: type_spec.use_map === "map",
      environment: type_spec.environment,
      stage: type_spec.stage,
      system: type_spec.system,
      subsystem: type_spec.subsystem,
      type: type_spec.type,
    })
    .then((r) =>
      r instanceof Error
        ? Promise.reject(r)
        : r?.map(
            ([file, fingerprint]) =>
              `/${encodeURIComponent(
                profileAsString(profile),
              )}${type_spec.normalizedPath()}/${encodeURIComponent(
                file,
              )}.hlasm?${fingerprint.toString()}`,
          ) ?? null,
    );
}

function readEndevorElement(
  e4e: E4E,
  file_spec: EndevorElement,
  profile: ResolvedProfile,
) {
  return e4e
    .getElement(profile, {
      use_map: file_spec.use_map === "map",
      environment: file_spec.environment,
      stage: file_spec.stage,
      system: file_spec.system,
      subsystem: file_spec.subsystem,
      type: file_spec.type,
      element: file_spec.element,
      fingerprint: file_spec.fingerprint,
    })
    .then((r) => (r instanceof Error ? Promise.reject(r) : r[0]));
}

function listEndevorMembers(
  e4e: E4E,
  type_spec: EndevorDataset,
  profile: ResolvedProfile,
) {
  return e4e
    .listMembers(profile, {
      dataset: type_spec.dataset,
    })
    .then((r) =>
      r instanceof Error
        ? Promise.reject(r)
        : r?.map(
            (member) =>
              `/${encodeURIComponent(
                profileAsString(profile),
              )}${type_spec.normalizedPath()}/${encodeURIComponent(
                member,
              )}.hlasm`,
          ) ?? null,
    );
}

function readEndevorMember(
  e4e: E4E,
  file_spec: EndevorMember,
  profile: ResolvedProfile,
) {
  return e4e
    .getMember(profile, {
      dataset: file_spec.dataset,
      member: file_spec.member,
    })
    .then((r) => (r instanceof Error ? Promise.reject(r) : r));
}

export function translateLibs(x: string, profile: string): string;
export function translateLibs<T extends object>(
  x: T,
  profile: string,
): T & { profile: string };
export function translateLibs(x: string | object, profile: string) {
  if (typeof x === "string") return x;
  return { ...x, profile };
}
export function profileAsString(profile: ResolvedProfile) {
  return `${profile.instance}@${profile.profile}`;
}

export type Library =
  | string
  | {
      path: string;
      optional?: boolean;
      macro_extensions?: string[];
      prefer_alternate_root?: boolean;
    }
  | {
      dataset: string;
      optional?: boolean;
      profile?: string;
    }
  | {
      environment: string;
      stage: string;
      system: string;
      subsystem: string;
      type: string;
      use_map?: boolean;
      optional?: boolean;
      profile?: string;
    };

interface e4eResponse {
  configuration: E4EExternalConfigurationResponse;
  api: IEndevorApiClient;
  profile: ResolvedProfile;
}
