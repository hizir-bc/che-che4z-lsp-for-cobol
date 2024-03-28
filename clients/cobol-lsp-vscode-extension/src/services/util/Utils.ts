/*
 * Copyright (c) 2020 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Broadcom, Inc. - initial API and implementation
 */

import * as vscode from "vscode";
import * as path from "path";
import { E4E_SCHEME, LOOKING_FOR_COPYBOOK_LOCATION } from "../../constants";
import {
  IEndevorApiClient,
  e4eResponse,
  defaultConfigs,
  profileAsString,
  translateLibs,
  E4EExternalConfigurationResponse,
} from "../../type/endevorApi.d";
/**
 * This class collects utility methods for general purpose activities
 */
export class Utils {
  static extPath: string;
  /**
   * This method provides a quick way to verify if the input is null or undefined.
   * The idea is to have something similar to the util library {@link node.isNullOrUndefined} that is deprecated.
   * @param content the string value target of the validation
   * @return true if the content is not null or undefined, false otherwise
   */
  public static isNullOrUndefined(content: string): boolean {
    return content === null || content === undefined;
  }

  public static async getZoweExplorerAPI(): Promise<IApiRegisterClient> {
    const ext = vscode.extensions.getExtension(
      "Zowe.vscode-extension-for-zowe",
    );
    if (!ext) {
      return Promise.resolve(undefined);
    }
    await ext.activate();
    return ext.exports as any;
  }

  private static async getEndevorExplorerAPI(): Promise<IEndevorApiClient> {
    const ext = vscode.extensions.getExtension(
      "BroadcomMFD.explorer-for-endevor",
    );

    if (!ext) {
      return Promise.resolve(undefined);
    }

    await ext.activate();
    return ext.exports as any;
  }

  public static async getE4EAPI(
    uri: vscode.Uri,
    outputChannel: vscode.OutputChannel,
  ): Promise<e4eResponse | null> {
    const e4e: IEndevorApiClient = await this.getEndevorExplorerAPI();

    const uriString = uri.toString();
    if (!e4e || !e4e?.isEndevorElement(uriString)) return null;

    const profile = await e4e.getProfileInfo(uriString);
    if (profile instanceof Error) throw profile;

    const result: E4EExternalConfigurationResponse | Error =
      await e4e.getConfiguration(uriString, defaultConfigs);
    if (result instanceof Error) throw result;

    const candidate = result.pgroups.find(
      (x) => x.name === result.pgms[0].pgroup,
    );
    if (!candidate) throw Error("Invalid configuration");

    this.writeLocationLogs(candidate?.libs, outputChannel);

    return {
      configuration: {
        name: candidate.name,
        libs: candidate.libs.map((x) =>
          translateLibs(x, profileAsString(profile)),
        ),
      },
      profile: profile,
      api: e4e,
      uri: uri,
    };
  }
  public static setExtensionsFolder(path: string) {
    this.extPath = path;
  }

  public static getExtensionFolder(): string {
    return this.extPath;
  }
  public static isEndevorFile(uri: String): boolean {
    return uri.startsWith(E4E_SCHEME);
  }

  private static writeLocationLogs(entries, outputChannel) {
    entries.forEach((libEntry) => {
      outputChannel.appendLine(
        LOOKING_FOR_COPYBOOK_LOCATION + JSON.stringify(libEntry),
      );
    });
  }
}
