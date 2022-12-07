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
package org.eclipse.lsp.cobol.dialects.daco.usecases;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import org.eclipse.lsp.cobol.common.error.ErrorSource;
import org.eclipse.lsp.cobol.dialects.daco.utils.DialectConfigs;
import org.eclipse.lsp.cobol.test.engine.UseCaseEngine;
import org.eclipse.lsp4j.Diagnostic;
import org.eclipse.lsp4j.DiagnosticSeverity;
import org.eclipse.lsp4j.Range;
import org.junit.jupiter.api.Test;

/** Tests the DaCo ROW GET statement */
class TestDaCoTableRowGetStatement {

  private static final String TEXT =
      "        IDENTIFICATION DIVISION. \r\n"
          + "        PROGRAM-ID. test1. \r\n"
          + "        ENVIRONMENT DIVISION.\n"
          + "        IDMS-CONTROL SECTION.\n"
          + "            PROTOCOL. MODE ABC.\n"
          + "            IDMS-RECORDS MANUAL\n"
          + "        DATA DIVISION. \r\n"
          + "        WORKING-STORAGE SECTION. \r\n"
          + "        01 {$*WS-AREA}. \r\n"
          + "           03 {$*AREA-XW1}. \r\n"
          + "             05 {$*TBLPRO-XL1}. \r\n"
          + "               07 FILLER               PIC X(5)    VALUE 'REMBD'. \r\n"
          + "             05 {$*TBFPRO-XL1}. \r\n"
          + "               07 FILLER               PIC X(5)    VALUE 'REMBD'. \r\n"
          + "             05 {$*DSAPRO-XL1}. \r\n"
          + "               07 FILLER               PIC X(5)    VALUE 'REMBD'. \r\n"
          + "        PROCEDURE DIVISION. \r\n"
          + "            ROW GET {$TBLPRO-XL1}. \r\n"
          + "            ROW GET {$TBFPRO-XL1}. \r\n"
          + "            ROW GET {$TBLPRO-XL1} ON 2. \r\n"
          + "            ROW GET {$TBFPRO-XL1} ON 2. \r\n"
          + "            ROW GET {$TBLPRO-XL1} ON 'ABC'. \r\n"
          + "            ROW GET {$TBFPRO-XL1} ON 'ABC'. \r\n"
          + "            ROW GET {$TBLPRO-XL1} ON {$DSAPRO-XL1}. \r\n"
          + "            ROW GET {$TBFPRO-XL1} ON {$DSAPRO-XL1}. \r\n"
          + "            ROW GET {$TBLPRO-XL1} ON {$DSAPRO-XL1} TO {$DSAPRO-XL1}. \r\n"
          + "            ROW GET {$TBFPRO-XL1} ON {$DSAPRO-XL1} TO {$DSAPRO-XL1}. \r\n"
          + "            ROW GET {$TBLPRO-XL1} TO {$DSAPRO-XL1}. \r\n"
          + "            ROW GET {$TBFPRO-XL1} TO {$DSAPRO-XL1}. \r\n"
          // Negative tests
          + "            ROW GET {$DSAPRO-XL1|1}. \r\n"
          + "            ROW GET {GBR4|1|2}. \r\n"
          + "            ROW GET {$TBLPRO-XL1} ON {GBR4|2}. \r\n"
          + "            ROW GET {$TBLPRO-XL1} ON {$DSAPRO-XL1} TO {GBR4|2}. \r\n"
          + "            ROW GET {$TBLPRO-XL1} TO {GBR4|2}. \r\n";

  @Test
  void test() {

    UseCaseEngine.runTest(
        TEXT,
        ImmutableList.of(),
        ImmutableMap.of(
            "1",
            new Diagnostic(
                new Range(),
                "String must starts with TBL or TBF values",
                DiagnosticSeverity.Error,
                ErrorSource.DIALECT.getText()),
            "2",
            new Diagnostic(
                new Range(),
                "Variable GBR4 is not defined",
                DiagnosticSeverity.Error,
                ErrorSource.PARSING.getText())),
        ImmutableList.of(),
        DialectConfigs.getDaCoAnalysisConfig());
  }
}
