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
 *    Broadcom, Inc. - initial API and implementation
 *    DAF Trucks NV – implementation of DaCo COBOL statements
 *    and DAF development standards
 *
 */
package org.eclipse.lsp.cobol.core;

import org.antlr.v4.runtime.CommonTokenStream;

/**
 * A Cobol Parser Abstraction.
 */
public interface AstBuilder {
  /**
   * Produce AST of the source.
   *
   * @return the AST root node.
   */
  CobolParser.StartRuleContext runParser();

  /**
   * Get the tokens of input source.
   *
   * @return Token stream.
   */
  CommonTokenStream getTokens();
}
