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

export type ElementInfo = {
  sourceUri?: string;
  environment: string;
  stage: string;
  system: string;
  subsystem: string;
  type: string;
  processorGroup?: string;
  fingerprint?: string;
  element: string;
};

export type ResolvedProfile = {
  profile: string; // "source/name" - this might be a subject to change in 2.0
  instance: string;
};

export type ExternalConfigurationOptions = {
  compiler?: string;
  preProcessors?: string[];
} & (
  | {
      type: ProcessorConfigurationType.COBOL;
    }
  | {
      type: ProcessorConfigurationType.HLASM;
    }
);

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
  onDidChangeElement: Event<ElementInfo[]>;
}
