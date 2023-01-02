package org.eclipse.lsp.cobol.common.mapping;

import org.eclipse.lsp4j.Location;
import org.eclipse.lsp4j.Range;

public interface Mapping {
  OriginalLocation mapLocation(Range range);
}
