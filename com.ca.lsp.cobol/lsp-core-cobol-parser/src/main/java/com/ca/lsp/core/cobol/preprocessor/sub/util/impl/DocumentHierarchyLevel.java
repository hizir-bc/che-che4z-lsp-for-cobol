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
 *
 */

package com.ca.lsp.core.cobol.preprocessor.sub.util.impl;

import com.broadcom.lsp.domain.common.model.Position;
import com.ca.lsp.core.cobol.model.DocumentMapping;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.List;
import java.util.Map;

/**
 * This class represents a document hierarchy level (i.e. the COBOL document or (nested) copybook),
 * using to map the positions from the extended document to the original ones. Index here means the
 * pointer to the current position in the list of the original positions. Shifts is a map of values
 * to increase the index in order to skip some positions.
 */
class DocumentHierarchyLevel {
  private int index;
  private List<Position> positions;
  private Map<Integer, Integer> shifts;

  DocumentHierarchyLevel(@Nonnull DocumentMapping documentMapping) {
    index = 0;
    positions = documentMapping.getPositions();
    shifts = documentMapping.getShifts();
    initialForward();
  }

  /**
   * Get the position by the current index or null if the index is more than the list size.
   *
   * @return the current position or null.
   */
  @Nullable
  public Position getCurrent() {
    return index < positions.size() ? positions.get(index) : null;
  }

  /** Increase the index by one or by shift if specified */
  void forward() {
    index += shifts.getOrDefault(index, 1);
  }

  /**
   * Get the list of position from current to the end of the list inclusive.
   *
   * @return sublist of positions to the end of the list or an empty list.
   */
  @Nonnull
  List<Position> lookahead() {
    int tail = positions.size() - index;
    if (tail < 1) return List.of();
    return positions.subList(index, index + tail);
  }

  /**
   * Increase the index by the given value.
   *
   * @param length - value to increase the index
   */
  void forceForward(int length) {
    index += length;
  }

  /**
   * Increase the index by the shift assigned to the 0 position, or by zero. Useful to skip the
   * positions of the compiler directives.
   */
  private void initialForward() {
    index += shifts.getOrDefault(index, 0);
  }
}
