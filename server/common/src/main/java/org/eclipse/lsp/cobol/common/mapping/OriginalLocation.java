/*
 * Copyright (c) 2022 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *    Broadcom, Inc. - initial API and implementation
 *
 */
package org.eclipse.lsp.cobol.common.mapping;

import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.eclipse.lsp.cobol.common.model.Locality;
import org.eclipse.lsp4j.Location;

import java.util.HashMap;
import java.util.Map;

/** Class represents Location in original source code files */
@Value
@RequiredArgsConstructor
public class OriginalLocation {
  Map<String, Locality> cache = new HashMap<>();
  Location location;
  String copybookId;

  /**
   * Create a locality object for token.
   * @param token a token for locality
   * @return an object of Locality
   */
  public Locality toLocality(String token) {
    return cache.computeIfAbsent(token, t -> Locality.builder()
            .uri(location.getUri())
            .token(t)
            .range(location.getRange())
            .build());
  }
}
