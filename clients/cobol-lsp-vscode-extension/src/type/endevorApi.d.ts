import { Event, Uri } from "vscode";
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
interface e4eResponse {
  configuration: {
    name: string;
    libs: any[];
  };
  api: IEndevorApiClient;
  profile: ResolvedProfile;
  uri: Uri;
}
