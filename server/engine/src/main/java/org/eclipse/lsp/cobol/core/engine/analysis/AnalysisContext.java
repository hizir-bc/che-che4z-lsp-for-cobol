/*
 * Copyright (c) 2021 Broadcom.
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
package org.eclipse.lsp.cobol.core.engine.analysis;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.lsp.cobol.common.AnalysisConfig;
import org.eclipse.lsp.cobol.common.error.SyntaxError;
import org.eclipse.lsp.cobol.common.mapping.ExtendedDocument;
import org.eclipse.lsp.cobol.common.model.tree.Node;
import org.eclipse.lsp.cobol.core.semantics.CopybooksRepository;

import java.util.*;

/**
 * Contains related to analysis state
 */
@RequiredArgsConstructor
@Slf4j
public class AnalysisContext {
  @Getter private final ExtendedDocument extendedDocument;
  @Getter private final AnalysisConfig config;
  @Getter private final List<SyntaxError> accumulatedErrors = new ArrayList<>();

  private @Getter @Setter List<Node> dialectNodes;
  private @Getter @Setter CopybooksRepository copybooksRepository;
}
