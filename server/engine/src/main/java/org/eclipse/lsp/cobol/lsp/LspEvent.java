/*
 * Copyright (c) 2023 Broadcom.
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
package org.eclipse.lsp.cobol.lsp;

import com.google.common.collect.ImmutableList;

import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * Event handler logic container.
 *
 * @param <T> event processing result type.
 */
@FunctionalInterface
public interface LspEvent<T> {
  /**
   * Event execute logic.
   *
   * @return execution result
   * @throws ExecutionException   forward possible exception.
   * @throws InterruptedException forward possible exception.
   */
  T execute() throws ExecutionException, InterruptedException;

  /**
   * Dependency data for the event. Allow to postpone the execution.
   * @return Dependencies is any.
   */
  default List<LspEventDependency> getDependencies() {
    return ImmutableList.of();
  }

  default List<LspEventCancelCondition> getCancelConditions() {
    return ImmutableList.of();
  }
}
