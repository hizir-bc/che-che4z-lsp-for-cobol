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
import { Utils } from "./Utils";

export class SettingsUtils {
  public static isValidJSON(json: string): boolean {
    return json !== undefined ? JSON.parse(json) : false;
  }

  public static getWorkspaceFoldersPath(
    fsPath: boolean | undefined = undefined,
  ): string[] {
    const result: string[] = [Utils.getC4ZHomeFolder()];
    return result;
  }
}
