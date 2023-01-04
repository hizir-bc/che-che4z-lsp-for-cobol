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
package org.eclipse.lsp.cobol.core.engine;

import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.Token;
import org.eclipse.lsp.cobol.common.mapping.ExtendedSource;
import org.eclipse.lsp.cobol.common.mapping.Mapping;
import org.eclipse.lsp.cobol.common.mapping.OriginalLocation;
import org.eclipse.lsp.cobol.common.model.Locality;
import org.eclipse.lsp.cobol.core.model.EmbeddedCode;
import org.eclipse.lsp.cobol.core.model.OldExtendedDocument;
import org.eclipse.lsp.cobol.core.preprocessor.delegates.util.LocalityMappingUtils;
import org.eclipse.lsp4j.Location;
import org.eclipse.lsp4j.Position;
import org.eclipse.lsp4j.Range;

import java.util.*;
import java.util.function.Predicate;

/**
 * The old mapping logic wrapper
 * @deprecated should be replaced with the new mapping
 */
@Deprecated
public class OldMapping implements Mapping {
  private static final int RANGE_LOOK_BACK_TOKENS = 5;
  private final Map<Token, OriginalLocation> map = new HashMap<>();
  private final Map<Range, OriginalLocation> rangeMap = new HashMap<>();

  public OldMapping(Map<Token, Locality> initialMap) {
    initialMap.forEach((k, v) -> {
      OriginalLocation location = new OriginalLocation(v.toLocation(), v.getCopybookId());
      map.put(k, location);
      rangeMap.put(toRange(k), location);
    });
  }
  public OldMapping(
          String documentUri,
          OldExtendedDocument oldExtendedDocument,
          CommonTokenStream tokens,
          Map<Token, EmbeddedCode> embeddedCodeParts,
          ExtendedSource extendedSource) {
    Map<org.antlr.v4.runtime.Token, Locality> mapping =
            LocalityMappingUtils.createPositionMapping(
                    tokens.getTokens(),
                    oldExtendedDocument.getDocumentMapping(),
                    documentUri,
                    embeddedCodeParts);
    mapping.forEach(
            (k, v) -> {
              if (v.getUri().equals(documentUri)) {
                Location l = extendedSource.mapLocation(v.getRange()).getLocation();

                v.getRange().setStart(l.getRange().getStart());
                v.getRange().setEnd(l.getRange().getEnd());
                v.setUri(l.getUri());
              }
              OriginalLocation location = new OriginalLocation(v.toLocation(), v.getCopybookId());
              map.put(k, location);
              rangeMap.put(toRange(k), location);
            });
  }

  /**
   * Extract token range
   * @param token a token
   * @return a range
   */
  public static Range toRange(Token token) {
    return new Range(
            new Position(token.getLine() - 1, token.getCharPositionInLine()),
            new Position(token.getLine() - 1, token.getCharPositionInLine() + token.getStopIndex() - token.getStartIndex() + 1));
  }

  /**
   * Map a token.
   * @param token toking to map
   * @return location of token
   */
  public Locality map(Token token) {
    OriginalLocation originalLocation = map.get(token);
    return originalLocation == null ? null : originalLocation.toLocality(token.getText());
  }

  /**
   * Map a token.
   * @param token toking to map
   * @param ifAbsent a value to use in case of missing data about token
   * @return location of token
   */
  public Locality map(Token token, Locality ifAbsent) {
    return map.computeIfAbsent(token, it -> new OriginalLocation(ifAbsent.toLocation(), ifAbsent.getCopybookId()))
            .toLocality(token.getText());
  }

  @Override
  public OriginalLocation mapLocation(Range range) {
    return rangeMap.get(range);
  }

  private Map.Entry<Token, OriginalLocation> lookBackLocality(int index) {
    if (index < 0) {
      return null;
    }

    return map.entrySet().stream()
            .filter(previousIndexes(index))
            .filter(isNotHidden())
            .max(Comparator.comparingInt(it -> it.getKey().getTokenIndex()))
            .orElse(null);
  }

  private Predicate<Map.Entry<Token, OriginalLocation>> isNotHidden() {
    return it -> it.getKey().getChannel() != Token.HIDDEN_CHANNEL;
  }

  private Predicate<Map.Entry<Token, OriginalLocation>> previousIndexes(int index) {
    return it ->
            it.getKey().getTokenIndex() <= index
                    && it.getKey().getTokenIndex() >= index - RANGE_LOOK_BACK_TOKENS;
  }

  /**
   * Find previous visible token before the given one and return its locality or null if not found.
   * Checks at most RANGE_LOOK_BACK_TOKENS previous tokens. For example, embedded languages may
   * produce errors on the edge positions that don't belong to the mapping.
   *
   * @param tokenIndex to find previous visible locality
   * @return Locality for a passed token or null
   */
  public Locality findPreviousVisibleLocality(int tokenIndex) {
    return Optional.ofNullable(lookBackLocality(tokenIndex))
        .map(e ->  map(e.getKey(), e.getValue() == null ? null : e.getValue().toLocality(e.getKey().getText())))
        .orElse(null);
  }
}
