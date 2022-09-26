/*
 * Copyright (c) 2022 DAF Trucks NV.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 * DAF Trucks NV – implementation of DaCo COBOL statements
 * and DAF development standards
 */
package org.eclipse.lsp.cobol.usecases.daco;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import org.eclipse.lsp.cobol.core.engine.dialects.daco.DaCoDialect;
import org.eclipse.lsp.cobol.positive.CobolText;
import org.eclipse.lsp.cobol.usecases.DialectConfigs;
import org.eclipse.lsp.cobol.usecases.engine.UseCaseEngine;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

/** Test for nested MAID Copybooks */
public class TestDaCoNestedCopybooks {
  private static final String TEXT =
      "       IDENTIFICATION DIVISION.\n"
          + "       PROGRAM-ID. TEST.\n"
          + "       ENVIRONMENT  DIVISION.\n"
          + "       IDMS-CONTROL SECTION.\n"
          + "       PROTOCOL.    MODE IS BATCH DEBUG\n"
          + "                    IDMS-RECORDS MANUAL.\n"
          + "       CONFIGURATION    SECTION.\n"
          + "       DATA DIVISION.\n"
          + "       WORKING-STORAGE SECTION.\n"
          + "           01 COPY MAID CB1.\n"
          + "       PROCEDURE DIVISION.\n"
          + "           DISPLAY LEAF.";

  private static final String CB1 = "       01  ROOT.\n" + "           02 COPY MAID CB2.";
  private static final String CB2 = "       01  ROOT.\n" + "           02 LEAF PIC 9(X).";

  @Test
  void test() {
    UseCaseEngine.runTest(
        TEXT,
        ImmutableList.of(
            new CobolText("CB1", DaCoDialect.NAME, CB1),
            new CobolText("CB2", DaCoDialect.NAME, CB2)),
        ImmutableMap.of(),
        ImmutableList.of(),
        DialectConfigs.getDaCoAnalysisConfig());
  }
}
